import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
MODEL_PATH = os.getenv("MODEL_PATH")
THRESHOLD_PATH = os.getenv("THRESHOLD_PATH")
