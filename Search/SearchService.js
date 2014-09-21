var client = require('../Util/SearchUtil');

var Module = function () {
};

Module.prototype.attachRoutes = function (server) {
	server.get('/search/:term', this.query);
};

Module.prototype.query = function (req, res, next) {
	if (req.params.term) {
		var keyword = req.params.term;
		console.log("####search word####: " + keyword);
		var privateResult = [], publicResult = [], privateFlag = false, publicFlag = false;
		var result = {};
		var startTime = new Date().getTime();

		//private food
		client.search({
			index: 'search',
			type: 'privatedishes',
			body: {
				from: 0,
				size: 20,
				query: {
					fuzzy_like_this: {
						like_text: keyword,
						fields: ["privatedish.brand", "privatedish.name"]
					}
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