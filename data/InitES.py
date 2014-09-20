#create mapping
'''
curl -XPUT 'http://localhost:9200/search/publicdishes/_mapping' -d '
{
	"publicdishes" : {
		"properties" : {
			"brand" : {"type" : "string", "store": true, "index": "analyzed", "null_value": "na"},
			"name" : {"type" : "string", "store": true, "index": "analyzed", "null_value": "na"}
		}
	}
}
'
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

def createMapping():
	publicMapping = '{"publicdishes" : {"properties" : {"brand" : {"type" : "string", "store": true, "index": "analyzed", "null_value": "na"},"name" : {"type" : "string", "store": true, "index": "analyzed", "null_value": "na"}}}}'
	privateMapping = '{"privatedishes" : {"properties" : {"brand" : {"type" : "string", "store": true, "index": "analyzed", "null_value": "na"},"name" : {"type" : "string", "store": true, "index": "analyzed", "null_value": "na"},"usedId" : {"type" : "integer", "index" : "not_analyzed"}}}}'
	subprocess.call(["curl", "-XPUT", "http://localhost:9200/search/publicdishes/_mapping", "-d", publicMapping])
	subprocess.call(["curl", "-XPUT", "http://localhost:9200/search/privatedishes/_mapping", "-d", privateMapping])

def createData():
	
