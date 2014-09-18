var client = require('..//Util/SearchUtil');

var Module = function () {
};

Module.prototype.attachRoutes = function (server) {
	server.get('/search/:term', this.query);
};

Module.prototype.query = function (req, res, next) {
	if (req.params.term) {
		var q = req.params.term;
		client.search({
			q: 'user:' + q
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