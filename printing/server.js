var webshot = require('./lib/webshot/lib/webshot.js'),
  express = require('express'),
  http = require('http'),
  moment = require('moment'),
  gm = require('gm'),
  fs = require('fs'),
  app = express(),
  server = http.createServer(app),
  io = require('socket.io').listen(server),
  port = 8989,
  targetUrl = "http://localhost:8000/planner/",
  socketUrl = "http://localhost:" + port,
  staticDir = "shots/",
  clients = {},
  constraints = {
    'letter': {
      width: 612,
      height: 792
    },
    'ledger': {
      width: 1224,
      height: 792
    },
    'A4': {
      width: 595,
      height: 842
    },
    'A3': {
      width: 842,
      height: 1191
    }
  }


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

  socket.on('shot', function(data, cb) {
    var ts = moment().format('YYYYDDmmHHss'),
      filename = ts + '-' + socket.id;
      options = {
        userAgent: data.userAgent,
        screenSize: {
          width: data.screenWidth,
          height: data.screenHeight
        },
        shotSize: {
          width: data.mapWidth,
          height: data.mapHeight
        }
      },
      hash = data.hash + "&print=true";
    console.dir(options);
    if (data.title) {
      hash = hash + "&title=" + data.title;
    }
    if (data.borderless === true) {
      hash = hash + "&borderless=true";
    }
    console.dir(data);
    console.log(hash);
    webshot(targetUrl + hash, staticDir + filename + '.png', options, function(err) {
      var original = staticDir + filename + '.png',
          target =  staticDir + filename + data.format,
          img = gm(original),
          done = function () {
            cb({
              path: socketUrl + '/' + filename + data.format,
              download: socketUrl + '/download/' + filename + data.format
            });
          };


      if (! err) {
        img.quality(100);

        if (data.format === '.pdf') {
          img.resize(constraints[data.paperSize].width);
          img.extent(constraints[data.paperSize].width, constraints[data.paperSize].width);
        } else {
          img.resize(parseInt(data.shotWidth, 10), parseInt(data.shotHeight, 10));          
        }
        img.write(target, done);
      }
      
    });

  });

});