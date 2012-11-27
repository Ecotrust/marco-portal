var webshot = require('./lib/webshot/lib/webshot.js'),
  argv = require('optimist').argv,
  express = require('express'),
  http = require('http'),
  moment = require('moment'),
  zip = require("node-native-zip"),
  gm = require('gm'),
  fs = require('fs'),
  app = express(),
  server = http.createServer(app),
  io = require('socket.io').listen(server),
  port = argv.port || 8989,
  targetUrl = argv.appurl || "http://localhost/visualize",
  socketUrl = argv.socketurl + ':' + port || "http://localhost:" + port,
  staticDir = "shots/",
  phantomPath = argv.phantomjs || "/usr/bin/phantomjs";

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


// fix urls without trailing slash
if (targetUrl.slice(-1) !== '/') {
  targetUrl = targetUrl + '/';
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
        }, 
        phantomPath: phantomPath
      },
      hash = data.hash + "&print=true";
    if (data.title) {
      hash = hash + "&title=" + data.title;
    }
    if (data.borderless === true) {
      hash = hash + "&borderless=true";
    }
    console.dir(data);
    console.log(targetUrl + hash);
    webshot(targetUrl + hash, staticDir + filename + '.png', options, function(err) {
      var original = staticDir + filename + '.png',
          target =  staticDir + filename,
          img = gm(original),
          done = function (format) {
            var format = format || data.format
                path = socketUrl + '/' + filename + format,
                thumb = socketUrl + '/thumb-' + filename + '.png';
            cb({
              thumb: thumb,
              path: path,
              download: socketUrl + '/download/' + filename + format
            });
          },
          zipTiff = function (cb) {
            var archive = new zip(),
                worldString = data.pixelSize + "\n0\n0\n" + 
                  data.pixelSize * -1 + '\n' + data.extent[0] + '\n'
                  data.extent[3] + '\n',
                prjFileString = 'GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]]';

            archive.add(filename + '.tfw', new Buffer(worldString, "utf8"));
            archive.add(filename + '.prj', new Buffer(prjFileString, "utf8"));

            console.dir(worldString);
            archive.addFiles([{ name: filename + data.format, path: target + data.format }],
              function (err) {
                console.dir(err);
                fs.writeFile(staticDir + filename+ '.zip', archive.toBuffer(), function () {
                  cb('.zip')
                });
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

        img.write(target + data.format, function () {
          gm(original).resize(350, 350)
            .write(staticDir +'thumb-' + filename + '.png', function (err) {
            if (err) {
              console.log(err);
            }
            if (data.format === '.tiff') {
              zipTiff(done); 
            } else {
              done();              
            }
          });
        });
      }
    });
  });
});