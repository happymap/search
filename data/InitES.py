#create mapping
'''
curl -XPUT 'http://localhost:9200/search/publicdishes/_mapping' -d '{"publicdishes" : {"properties" : {"brand" : {"type" : "string", "store": true, "index": "analyzed", "null_value": "na"},"name" : {"type" : "string", "store": true, "index": "analyzed", "null_value": "na"}}}}'
'''

'''
curl -XPUT 'http://localhost:9200/search/privatedishes/_mapping' -d '
{
	"privatedishes" : {
		"properties" : {
			"brand" : {"type" : "string", "store": true, "index": "analyzed", "null_value": "na"},
			"name" : {"type" : "string", "store": true, "index": "analyzed", "null_value": "na"},
			"usedId" : {"type" : "integer", "index" : "not_analyzed"}
		}
	}
}
'
'''

import subprocess
import pymongo

connection_string = 'mongodb://localhost'
connection = pymongo.Connection(connection_string, safe=True)
db = connection.search
publicdishes = db.publicdishes
privatedishes = db.privatedishes

def createMapping():
	publicMapping = '{"publicdishes" : {"properties" : {"brand" : {"type" : "string", "store": true, "index": "analyzed", "null_value": "na"},"name" : {"type" : "string", "store": true, "index": "analyzed", "null_value": "na"}}}}'
	privateMapping = '{"privatedishes" : {"properties" : {"brand" : {"type" : "string", "store": true, "index": "analyzed", "null_value": "na"},"name" : {"type" : "string", "store": true, "index": "analyzed", "null_value": "na"},"usedId" : {"type" : "integer", "index" : "not_analyzed"}}}}'
	subprocess.call(["curl", "-XPUT", "http://localhost:9200/search/publicdishes/_mapping", "-d", publicMapping])
	subprocess.call(["curl", "-XPUT", "http://localhost:9200/search/privatedishes/_mapping", "-d", privateMapping])

def createData():
	publiccount = publicdishes.find().count()
	offset = 0
	batch_size = 100
	while (offset < publiccount):
		batchedPublicDishes = publicdishes.find()[offset : offset + batch_size]
		for publicdish in batchedPublicDishes:
			publicstr = '{"publicdish": {"brand":"' +  publicdish['brand'] + '","name":"' + publicdish['name'] + '","calories":' + str(publicdish['calories']) + ', "serving":' + str(publicdish['serving']) +'}}'
			subprocess.call(["curl", "-XPUT", "http://localhost:9200/search/publicdishes/" + str(publicdish['_id']), "-d", publicstr])
		offset += batch_size

	privatecount = privatedishes.find().count()
	offset = 0
	while (offset < privatecount):
		batchedPrivateDishes = privatedishes.find()[offset : offset + batch_size]
		for privatedish in batchedPrivateDishes:
			privatestr = '{"privatedish": {"brand":"' +  privatedish['brand'] + '","name":"' + privatedish['name'] + '","calories":' + str(privatedish['calories']) + ', "serving":' + str(privatedish['serving']) + ', "userId":' + str(privatedish['userId']) +'}}'
			subprocess.call(["curl", "-XPUT", "http://localhost:9200/search/privatedishes/" + str(privatedish['_id']), "-d", privatestr])
		offset += batch_size


#step one: insert data
createData()

#step two: create index
createMapping()