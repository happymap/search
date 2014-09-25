import subprocess
import pymongo

'''
{"type": "mongodb","mongodb": {"db": "search","collection": "publicdishes"},"index": {"name": "search","type": "publicdish"}}
'''

def createRiver():
	subprocess.call(['curl', '-XPUT', 'http://localhost:9200/_river/mongodb/_meta', '-d', '{"type": "mongodb","mongodb": {"db": "search","collection": "publicdishes"},"index": {"name": "search","type": "publicdish"}}'])

createRiver()
