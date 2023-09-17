from pymongo import MongoClient
from models import Transaction  # Import your Transaction model from models.py

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")  # Adjust the MongoDB connection string
db = client["your_database_name"]  # Replace with your actual database name

# Sample transaction data
sample_data = [
    {
        "cardType": "Visa",
        "channel": "Online",
        "transactionType": "Purchase",
        "transactionTypeGroup": "Retail",
        "entryMode": "Swipe",
        "outletId": "12345",
        "merchantCountry": "US",
        "merchantActivity": "Retail",
        "clientCode": "ABCD",
        "amountUSD": 100.0,
    },
    # Add more sample data as needed
]

# Insert sample data into MongoDB
for data in sample_data:
    transaction = Transaction(**data)
    transaction.save()
