from django.contrib.auth import get_user_model
from django.test import TestCase

from .models import PosterDraft

User = get_user_model()

CONTENT = {'data': {'headline': 'ഓണാശംസകൾ'}, 'style': {'layout': 'cStudio'}, 'elements': [], 'template': {'id': 'onam-cStudio-0', 'name': 'Onam', 'category': 'onam'}}


class PosterDraftTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='u', email='u@example.com', password='x')
        self.other = User.objects.create_user(username='o', email='o@example.com', password='x')
        self.client.force_login(self.user)

    def create(self, **extra):
        body = {'name': 'Onam offer', 'template_id': 'onam-cStudio-0', 'format': 'square', 'content': CONTENT, 'thumbnail': 'data:image/jpeg;base64,xx', **extra}
        return self.client.post('/api/marketing/poster-drafts/', body, content_type='application/json')

    def test_save_list_open_update_delete(self):
        res = self.create()
        self.assertEqual(res.status_code, 201)
        draft_id = res.json()['id']

        listing = self.client.get('/api/marketing/poster-drafts/').json()
        self.assertEqual(len(listing), 1)
        self.assertNotIn('content', listing[0])  # the grid skips the heavy content

        detail = self.client.get(f'/api/marketing/poster-drafts/{draft_id}/').json()
        self.assertEqual(detail['content']['data']['headline'], 'ഓണാശംസകൾ')

        res = self.client.patch(f'/api/marketing/poster-drafts/{draft_id}/', {'name': 'Renamed'}, content_type='application/json')
        self.assertEqual(res.json()['name'], 'Renamed')

        self.assertEqual(self.client.delete(f'/api/marketing/poster-drafts/{draft_id}/').status_code, 204)
        self.assertFalse(PosterDraft.objects.exists())

    def test_drafts_are_private(self):
        draft = PosterDraft.objects.create(user=self.other, name='Theirs', template_id='x', content=CONTENT)
        self.assertEqual(self.client.get('/api/marketing/poster-drafts/').json(), [])
        self.assertEqual(self.client.get(f'/api/marketing/poster-drafts/{draft.id}/').status_code, 404)
        self.assertEqual(self.client.delete(f'/api/marketing/poster-drafts/{draft.id}/').status_code, 404)

    def test_owner_is_the_signed_in_user(self):
        self.create(user=self.other.id)
        self.assertEqual(PosterDraft.objects.get().user, self.user)

    def test_requires_login(self):
        self.client.logout()
        self.assertEqual(self.client.get('/api/marketing/poster-drafts/').status_code, 401)
