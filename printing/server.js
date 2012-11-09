var webshot = require('./lib/webshot/lib/webshot.js'),
  express = require('express'),
  http = require('http'),
  moment = require('moment'),
  im = require('imagemagick'),
  fs = require('fs'),
  app = express(),
  server = http.createServer(app),
  io = require('socket.io').listen(server),
  port = 8989,
  targetUrl = "http://localhost:8000/planner/",
  socketUrl = "http://localhost:" + port,
  staticDir = "shots/",
  clients = {};


// sockets and static file server all listen on port 8989
app.use(express.static(__dirname + '/shots'));
server.listen(port);

app.get('/download/:file', function (req, res) {
   var file = req.params.file;
   fs.readFile(staticDir + req.params.file, function(err, data) {
      if(err) {
        res.send("Oops! Couldn't find that file.");
      } else {
        // set the content type based on the file
        res.contentType(req.params.file);
        res.setHeader('Content-disposition', 'attachment; filename=' + file);
        res.send(data);
      }   
      res.end();
    }); 
});

io.sockets.on('connection', function(socket) {
  //clients[socket.id] = socket;
  
  socket.on('ping', function () {
    console.log('ping!!!!!');
  });
  
  socket.on('shot', function(data, cb) {
    var ts = moment().format('YYYYDDmmHHss'),
      filename = ts + '-' + socket.id + data.format,
      options = {
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1309.0 Safari/537.17",
        screenSize: {
          width: data.screenWidth,
          height: data.screenHeight
        },
        shotSize: {
          width: data.shotWidth,
          height: data.shotHeight
        },
      
      },
      hash = data.hash + "&print=true";
    if (data.title) {
      hash = hash + "&title=" + data.title;
    }
    webshot(targetUrl + hash, staticDir + filename, options, function(err) {
      cb({
        path: socketUrl + '/' + filename,
        download: socketUrl + '/download/' + filename
      });
    });

  });

});