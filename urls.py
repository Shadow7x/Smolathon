# перед использование пропишите python manage.py shell
from django.urls import get_resolver
resolver = get_resolver()
def print_urls(urlpatterns, prefix=''):
    for pattern in urlpatterns:
        if hasattr(pattern, 'url_patterns'):
            # Это include
            print_urls(pattern.url_patterns, prefix + str(pattern.pattern))
        else:
            print(f"{prefix}{pattern.pattern} -> {getattr(pattern, 'name', 'No name')}")

print_urls(resolver.url_patterns)
