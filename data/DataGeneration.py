import pymongo
import re
import random

connection_string = 'mongodb://localhost'
connection = pymongo.Connection(connection_string, safe=True)
db = connection.ordering
rawstores = db.rawstores
rawdishes = db.rawdishes
dishes = db.dishes

batch_size = 100
offset = 0
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
		dishes.insert({'brand': brand, 
			'name': name,
			'calories': calories,
			'serving': serving,
			'userId': random.randint(0, 10)})
		
	offset += batch_size