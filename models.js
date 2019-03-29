'use strict'
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

const urlSchema = new mongoose.Schema({
    originalUrl : String,
   // urlCode : String,
    shortUrl : String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});


var shortURL = mongoose.model("shortURL", urlSchema);

module.exports.shortURL = shortURL;