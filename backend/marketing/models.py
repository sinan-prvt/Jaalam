from django.conf import settings
from django.db import models
from django.utils.text import slugify

class Blog(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    content = models.TextField()
    image_url = models.URLField(max_length=500, blank=True, null=True)
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
            # handle duplicates
            original_slug = self.slug
            counter = 1
            while Blog.objects.filter(slug=self.slug).exists():
                self.slug = f"{original_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class PosterDraft(models.Model):
    """A poster the user is editing: the template it started from plus every change, saved to come back to."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='poster_drafts')
    name = models.CharField(max_length=200)
    template_id = models.CharField(max_length=120)
    format = models.CharField(max_length=20, default='square')
    # {data, style, elements, template: {id, name, category}}; photos are inlined as data URLs
    content = models.JSONField(default=dict)
    # Small JPEG data URL for the library grid
    thumbnail = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return self.name
