"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dns = require("dns");
const url = require("url");

var cors = require("cors");

var app = express();

// Basic Configuration
var port = process.env.PORT || 3000;

/** this project needs a db !! **/

// mongoose.connect(process.env.DB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use("/public", express.static(process.cwd() + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
const urls = [];

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/shorturl/new", (req, res) => {
  const url = new URL(req.body.url);
  dns.lookup(url.hostname, (err, address) => {
    console.log(address);
    if (err && err.code === "ENOTFOUND") {
      res.json({
        error: "invalid URL"
      });
    } else {
      !urls.includes(url) && urls.push(url);
      res.json({
        original_url: url,
        short_url: urls.findIndex(entry => entry === url)
      });
    }
  });
});

// your first API endpoint...
app.get("/api/shorturl/:shorten", function(req, res) {
  const shorten = req.params.shorten;
  
  const originalURL = urls[Number(shorten)];
  console.log(shorten, originalURL)
  res.redirect(originalURL)
});

app.listen(port, function() {
  console.log("Node.js listening ...");
});
