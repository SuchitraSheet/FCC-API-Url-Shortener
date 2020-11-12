var express = require("express");
var dns = require("dns");

var bodyParser = require("body-parser");
var cors = require("cors");
var mongodb = require("mongodb");
var app = express();
const MongoClient = mongodb.MongoClient;
var app = express();
var appUrl;
var url;
var obj;
var longUrl;
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));
appUrl = "https://api--fcc.glitch.me/";
url = process.env.MONGO_URI;
 //"?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";
//process.env.MONGO_URI + '?retryWrites=true&w=majority';

app.get("/new/:longUrl(*)", function(req, res) {  
  longUrl = req.params.longUrl;
  longUrl = longUrl.slice(8);

  dns.lookup(longUrl, function(err, addresses) {
    if (addresses === undefined) {
      obj = { error: "invalid URL" };
      res.send(obj);
    }
    else 
    {
        mongodb.connect(url, function(err, db) {
        if (err)
        {
          console.log(err);
          res.send(err);
        }
        //console.log("connected successfully");
        var collection = db.collection("Urlshort");
        var longUrl = req.params.longUrl;
        longUrl = longUrl.slice(8);
        var uniqueId = new Date().getTime();
        uniqueId = uniqueId.toString();
        uniqueId = uniqueId.slice(0, -2);
        var shortUrl = appUrl + uniqueId;
        var product = {
          longUrl: longUrl,
          shortUrl: shortUrl,
          uniqueId: uniqueId
        };
        collection.insert(product, function(err, data) {
          if (err) {
            obj = { error: err };
          } else {
            console.log(data.insertedCount);
            var l = data.ops[0].longUrl;
            var s = data.ops[0].shortUrl;
            obj = { original_url: l, short_url: s };
          }
          res.json(obj);
        });
      });
    }
  });
});

app.get("/:uniqueId", function(req, res) {
  var obj;
  var uniqueId = req.params.uniqueId;
  if (uniqueId == "favicon.ico") {
    return res.sendStatus(204);
  } else {
    mongodb.connect(url, function(err, db) {
      if (err) {
        res.send(err);
      } else {
        db.collection("Urlshort")
          .find({
            uniqueId: uniqueId
          })
          .toArray(function(err, data) {
            if (err) {
              obj = { error: err };
              res.send(obj);
            }
            if (data.length <= 0) {
              obj = { length: 0 };
              res.send(obj);
            }
            var l = data[0].longUrl;
            res.redirect("https://" + l);
          });
      }
    });
  }
});

app.listen(3000, console.log("app listening on port 3000"));
