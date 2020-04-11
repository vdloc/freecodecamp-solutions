// server.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/timestamp/", (req, res) => {
  const current = new Date();

  res.json({
    unix: current.getTime(),
    utc: current.toUTCString()
  });
});
// your first API endpoint...
app.get(
  "/api/timestamp/:date_string",
  function(req, res) {
    const dateParam = req.params.date_string;
    const dateObj = new Date(dateParam);
    if (/\d{5,}/.test(dateParam)) {
      const unixDate = new Date(parseInt(dateParam));

      res.json({
        unix: dateParam,
        utc: unixDate.toUTCString()
      });
    } 
    
    if (dateObj.toUTCString() === "Invalid Date") {
      res.json({
        error: "Invalid Date"
      });
    } else {
      res.json({
        unix: dateObj.getTime(),
        utc: dateObj.toUTCString()
      });
    }
  }
);

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
