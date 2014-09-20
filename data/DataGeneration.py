import pymongo
import re
import random

connection_string = 'mongodb://localhost'
connection = pymongo.Connection(connection_string, safe=True)
db = connection.search
rawstores = db.rawstores
rawdishes = db.rawdishes
publicdishes = db.publicdishes
privatedishes = db.privatedishes

batch_size = 100
offset = 100001
count = rawdishes.find().count()
while (offset < count):
	batchedDishes = rawdishes.find()[offset : offset + batch_size]
	for dish in batchedDishes:
		print 'processing ' + dish['name']
		realStore = rawstores.find_one({'_id': dish['restaurantId']})
		brand = realStore['name']
		name = dish['name']
		calories = random.randint(100, 1500)
		serving = random.randint(1, 9)
		privatedishes.insert({'brand': brand, 
			'name': name,
			'calories': calories,
			'serving': serving,
			'userId': random.randint(10000, 20000)})
		print 'inserted successfully'
		
	offset += batch_size