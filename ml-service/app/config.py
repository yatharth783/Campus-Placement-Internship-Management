import os

PORT = int(os.getenv("PORT", os.getenv("ML_PORT", "8000")))
HOST = os.getenv("ML_HOST", "0.0.0.0")
DEBUG = os.getenv("DEBUG", "true").lower() == "true"
