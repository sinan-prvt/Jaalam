import os
import tempfile
from io import BytesIO
from unittest import mock

from django.contrib.auth import get_user_model
from django.core.files.storage import InMemoryStorage, default_storage
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command
from django.test import TestCase, override_settings
from PIL import Image

from marketing.models import Blog
from websites.models import Website, WebsiteContent

User = get_user_model()


def png_bytes(size, color='red'):
    buf = BytesIO()
    Image.new('RGB', size, color).save(buf, format='PNG')
    return buf.getvalue()


def jpeg_bytes(size, orientation=None):
    buf = BytesIO()
    img = Image.effect_noise(size, 80).convert('RGB')  # noisy, so it doesn't compress to nothing
    exif = Image.Exif()
    if orientation:
        exif[0x0112] = orientation
    img.save(buf, format='JPEG', quality=98, exif=exif)
    return buf.getvalue()


@override_settings(MEDIA_ROOT=tempfile.mkdtemp())
class UploadOptimizationTests(TestCase):
    def setUp(self):
        self.client.force_login(User.objects.create_user(username='u', email='u@example.com', password='x'))

    def upload(self, name, data, content_type):
        response = self.client.post('/api/websites/upload/', {'image': SimpleUploadedFile(name, data, content_type=content_type)})
        self.assertEqual(response.status_code, 200, response.content)
        name = response.json()['url'].rsplit('/', 1)[-1]
        with default_storage.open(name) as fh:
            data = fh.read()
        return Image.open(BytesIO(data)), len(data)

    def test_big_photo_is_resized_and_smaller(self):
        original = jpeg_bytes((4000, 3000))
        img, size = self.upload('big.jpg', original, 'image/jpeg')
        self.assertEqual(max(img.size), 2000)
        self.assertLess(size, len(original))

    def test_phone_rotation_is_applied(self):
        img, _ = self.upload('sideways.jpg', jpeg_bytes((300, 200), orientation=6), 'image/jpeg')  # 6 = rotate 90°
        self.assertEqual(img.size, (200, 300))

    def test_small_image_kept(self):
        img, _ = self.upload('small.png', png_bytes((40, 40)), 'image/png')
        self.assertEqual(img.size, (40, 40))


class MoveMediaCommandTests(TestCase):
    def setUp(self):
        self.media = tempfile.mkdtemp()
        with open(os.path.join(self.media, 'photo1.png'), 'wb') as fh:
            fh.write(png_bytes((10, 10)))
        user = User.objects.create_user(username='o', email='o@example.com', password='x')
        site = Website.objects.create(user=user, slug='s', business_type='Wedding Invitation')
        self.content = WebsiteContent.objects.create(
            website=site,
            gallery_json=['https://jaalam-backend.onrender.com/media/photo1.png'],
            settings_json={'wedding': {'mainPhoto': 'http://127.0.0.1:8000/media/photo1.png', 'other': 'https://example.com/keep.png'}},
        )
        self.blog = Blog.objects.create(title='T', content='c', image_url='https://jaalam-backend.onrender.com/media/photo1.png')

    def run_command(self, *args):
        bucket = InMemoryStorage(base_url='https://cdn.example.com/')  # stands in for S3/R2
        with override_settings(MEDIA_ROOT=self.media, AWS_STORAGE_BUCKET_NAME='test-bucket'), \
                mock.patch('websites.management.commands.move_media_to_storage.default_storage', bucket):
            call_command('move_media_to_storage', *args, stdout=open(os.devnull, 'w'))
        return bucket.exists('photo1.png')

    def test_dry_run_changes_nothing(self):
        self.run_command('--dry-run')
        self.content.refresh_from_db()
        self.assertEqual(self.content.gallery_json, ['https://jaalam-backend.onrender.com/media/photo1.png'])

    def test_uploads_and_rewrites_links(self):
        self.assertTrue(self.run_command())
        self.content.refresh_from_db()
        self.blog.refresh_from_db()
        self.assertEqual(self.content.gallery_json, ['https://cdn.example.com/photo1.png'])
        self.assertEqual(self.content.settings_json['wedding']['mainPhoto'], 'https://cdn.example.com/photo1.png')
        self.assertEqual(self.content.settings_json['wedding']['other'], 'https://example.com/keep.png')
        self.assertEqual(self.blog.image_url, 'https://cdn.example.com/photo1.png')
