var express = require('express'),
	app = express(),
	server = require('http').createServer(app);

app.use(express.static(__dirname + '/public'));

var services = ['Search'];

var initDynamicRoutes = function(server) {
	var i, ii;
	for (i = 0, ii = services.length; i < ii; ++i) {
		require('./' + services[i] + '/' + services[i] + 'Service').attachRoutes(server);
	}
};

initDynamicRoutes(app);
server = app.listen(3000, function() {
	console.log('listening on port %d', server.address().port);
});