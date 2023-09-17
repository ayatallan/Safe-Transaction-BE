import mongoengine

# Define your MongoDB connection settings (replace with your actual database URL)
db_host = 'mongodb://localhost:27017/your_database_name'

# Connect to MongoDB using the default connection alias
mongoengine.connect(host=db_host, alias='default')

from mongoengine import Document, StringField, FloatField

# Define your MongoDB model(s) here
class Transaction(Document):
    cardType = StringField()
    channel = StringField()
    transactionType = StringField()
    transactionTypeGroup = StringField()
    entryMode = StringField()
    outletId = StringField()
    merchantCountry = StringField()
    merchantActivity = StringField()
    clientCode = StringField()
    amountUSD = FloatField()
