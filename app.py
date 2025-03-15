# ...existing code...
from flask_cors import CORS

# Enable CORS for the Flask app
CORS(app)

# Optionally, configure specific CORS options
# CORS(app, resources={r"/api/*": {"origins": "http://example.com"}})

# ...existing code...
