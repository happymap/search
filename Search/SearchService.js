var client = require('../Util/SearchUtil'),
	SearchPersistence = require('./SearchPersistence');

var Module = function () {
};

Module.prototype.attachRoutes = function (server) {
	server.get('/search/:term', this.query);
	server.get('/search_mongo/:term', this.mongoquery);
};

Module.prototype.mongoquery = function (req, res, next) {
	if (req.params.term) {
		var userId = parseInt(req.query.userId);
		var startTime = new Date().getTime();
		SearchPersistence.searchMongo(req.params.term, userId, function(err, data) {
			if (err) {
				res.send(err);
			} else {
				var result = {};
				result.time = new Date().getTime() - startTime;
				result.data = data;
				res.send(result);
			}
		});
	} else {
		res.send(400);
	}
}

Module.prototype.query = function (req, res, next) {
	if (req.params.term) {
		var keyword = req.params.term;
		console.log("####search word####: " + keyword);
		var privateResult = [], publicResult = [], privateFlag = false, publicFlag = false;
		var result = {};
		var startTime = new Date().getTime();
		var userId = req.query.userId;

		//private food
		client.search({
			index: 'search',
			type: 'privatedishes',
			body: {
				from: 0,
				size: 25,
				query: {
					filtered: {
						filter: {
							bool: {
								should: [
									{ term: {'privatedish.userId': userId }}
								]
							}
						},
						query: {
							fuzzy_like_this: {
								like_text: keyword,
								fields: ["privatedish.brand", "privatedish.name"]
							}
						}
					},
					
				}
			}
		}).then(function (body) {
			var i = 0, data = body.hits.hits;
			for (; i < data.length; i++) {
				privateResult.push(data[i]);
			}
			privateFlag = true;
			if (privateFlag && publicFlag) {
				result.data = privateResult.concat(publicResult);
				result.time = new Date().getTime() - startTime;
				res.send(result);
			}
		}, function (error) {
			res.send(error.message);
		});

		//public food
		client.search({
			index: 'search',
			type: 'publicdishes',
			body: {
				from: 0,
				size: 20,
				query: {
					fuzzy_like_this: {
						like_text: keyword,
						fields: ["publicdish.brand", "publicdish.name"]
					}
				}
			}
		}).then(function (body) {
			var i = 0, data = body.hits.hits;
			for (; i < data.length; i++) {
				publicResult.push(data[i]);
			}
			publicFlag = true;
			if (privateFlag && publicFlag) {
				result.data = privateResult.concat(publicResult);
				result.time = new Date().getTime() - startTime;
				res.send(result);
			}
		}, function (error) {
			res.send(error.message);
		});
	} else {
		res.send(400);
	}
};

var instance = new Module();
module.exports = instance;