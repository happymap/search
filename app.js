var express = require('express'),
	app = express(),
	server = require('http').createServer(app);

app.use(express.static(__dirname + '/public'));

server = app.listen(3000, function() {
	console.log('listening on port %d', server.address().port);
});