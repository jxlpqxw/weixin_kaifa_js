var http = require('http');
var server = http.createserver(function(req,res){
	console.log(req.method);
	console.log(req.url);
	console.log(req.headers);
	res.end('Hello world');
});
server.listen(3001);
