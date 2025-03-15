# ...existing code...
INSTALLED_APPS += [
    'corsheaders',
]

MIDDLEWARE.insert(0, 'corsheaders.middleware.CorsMiddleware')

# Allow all origins (not recommended for production)
CORS_ALLOW_ALL_ORIGINS = True

# Optionally, configure specific origins
# CORS_ALLOWED_ORIGINS = [
#     "http://example.com",
# ]
# ...existing code...
