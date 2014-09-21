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
		client.search({
			index: 'search',
			type: 'publicdishes',
			body: {
				query: {
					fuzzy_like_this: {
						like_text: keyword,
						fields: ["publicdish.brand", "publicdish.name"]
					}
				}
			}
		}).then(function (body) {
			res.send(body.hits.hits);
		}, function (error) {
			res.send(error.message);
		});
	} else {
		res.send(400);
	}
};

var instance = new Module();
module.exports = instance;