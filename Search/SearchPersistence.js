var MongoClient = require('mongodb').MongoClient
,format = require('util').format;

var Module = function() {
};

Module.prototype.searchMongo = function(keyword, userId, cb) {
	MongoClient.connect('mongodb://127.0.0.1:27017/search', function(err, db) {
		if (err) cb(err, undefined);

		var privateResult = [], publicResult = [], privateFlag = false, publicFlag = false;

		var publicdishes = db.collection('publicdishes');
		publicdishes.find({
			$text: {
				$search: keyword
			}
		}).limit(25).toArray(function(error, results) {
			if (error) {
				cb(error, results);
			} else {
				publicResult = results;
				publicFlag = true;
				if (privateFlag && publicFlag) {
					cb(error, privateResult.concat(publicResult));
				}
			}
		});

		var privatedishes = db.collection('privatedishes');
		privatedishes.find({
			userId: userId,
			$text: {
				$search: keyword
			}
		}).limit(25).toArray(function(error, results) {
			if (error) {
				cb(error, results);
			} else {
				privateResult = results;
				console.log('private: ' + privateResult);
				privateFlag = true;
				if (privateFlag && publicFlag) {
					cb(error, privateResult.concat(publicResult));
				}
			}
		});		
	});
};

var instance = new Module();
module.exports = instance;