var webshot = require('./lib/webshot/lib/webshot.js'),
	express = require('express'), 
	http = require('http'),
    moment = require('moment'),
	app = express(),
	server = http.createServer(app),
	io = require('socket.io').listen(server),
    port = 8989,
	targetUrl = "http://localhost:8000/planner/",
    socketUrl = "http://localhost:" + port,
    staticDir = "shots/"


// sockets and static file server all listen on port 8989
app.use(express.static(__dirname+'/shots'));
server.listen(port);


io.sockets.on('connection', function (socket) {

  socket.on('shot', function (data, cb) {
    var ts = moment().format('YYYYDDmmHHss'),
        filename = socket.id + '-' + ts + '.png';

    // listen for screenshot event from client  
    setTimeout(function () {
    	webshot(targetUrl + data.hash, staticDir + filename,  function (err) {
    		cb({
                path: socketUrl + '/' + filename
            });
    	});	
    }, 1000);
    
  });

});

