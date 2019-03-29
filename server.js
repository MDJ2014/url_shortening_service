
var express = require('express');
var app = express();
const mongoose = require("mongoose");
var shortURL = require("./models").shortURL;
const validUrl = require("valid-url");
var bodyParser = require('body-parser');
const shortid = require('shortid');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
/*
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204
*/
// http://expressjs.com/en/starter/static-files.html

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/urlshortner");

var db = mongoose.connection;

db.on("error",function(err){
    console.error("connection error: ", err);
});


db.once("open", function(){
    console.log("Connected to MongoDb");
});



app.use(express.static('public'));






app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


app.get("/api/:short",function(req,res){
var short = req.params.short;

shortURL.findOne({shortUrl: short},function(err,item){
    if(err){
        res.json({"error": err});
    }

    if(item){

    res.redirect(item.originalUrl);

    }else{
        res.json({"error": "Not found"});
    }



});


});



app.post("/api/shorturl/new", function (req, res) {



var longUrl = req.body.originalUrl;



if (validUrl.isUri(longUrl)) {

  
    shortURL.findOne({ originalUrl: longUrl }, function(err,item){
        if(err){
            res.json({"error": err});
        }

       if(item){
                    res.json({"original_url": item.originalUrl,"short_url":item.shortUrl});
       }else{

        var newShortURL = shortid.generate();

        var newItem = new shortURL({
                originalUrl : longUrl,
                shortUrl : newShortURL  
            });

          newItem.save(function (err, item) {
            if(err){
                res.status(401);
                res.json({"error": err});
            }
               
       
              });


         res.status(201);
         res.json({"original_url":newItem.originalUrl,"short_url":newItem.shortUrl});
       }
        
    });



} else {
  return res
    .status(401)
    .json({"error":"Invalid Base URL"});

    }

});















var listener = app.listen(process.env.PORT || 3000, function () {
    console.log('Your app is listening on port ' + listener.address().port);
  });
