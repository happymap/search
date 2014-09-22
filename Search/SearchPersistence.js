var MongoClient = require('mongodb').MongoClient
	,format = require('util').format;

var Module = function() {
};

Module.prototype.searchMongo = function(keyword, cb) {
	MongoClient.connect('mongodb://127.0.0.1:27017/search', function(err, db) {
		if (err) throw err;

		var publicdishes = db.collection('publicdishes');
		publicdishes.find({$text: {$search: keyword}}).limit(25).toArray(function(err, results) {
			console.log(results);
			cb(results);
		});
	});
};