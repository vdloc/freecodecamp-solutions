const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const cors = require("cors");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require("moment");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const User = mongoose.model(
  "User",
  new Schema(
    {
      username: { type: String, required: true },
      count: Number,
      log: [
        {
          description: { type: String, required: true },
          duration: { type: Number, required: true },
          date: String
        }
      ]
    },
    { versionKey: false }
  )
);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const getFormattedDate = date => moment(date).format("ddd MMM DD YYYY");

app.post("/api/exercise/new-user", (req, res) => {
  const username = req.body.username;
  const user = new User({
    username
  });
  User.find({ username }, (err, userData) => {
    if (userData && userData.length) {
      res.send("The username was already taken");
    } else
      user.save((err, data) =>
        res.json({
          _id: data._id,
          username: data.username
        })
      );
  });
});

app.get("/api/exercise/users", (req, res) => {
  User.find({})
    .select("+_id +username -log")
    .exec((err, data) => res.json(data));
});

app.post("/api/exercise/add", (req, res) => {
  const exercise = req.body;
  const log = {
    description: exercise.description,
    duration: parseInt(exercise.duration),
    date: exercise.date || new Date()
  };
  
  User.findByIdAndUpdate(
    exercise.userId,
    { $push: { log: log } },
    (err, data) => {
      const result = {
        _id: data._id,
        username: data.username,
        description: log.description,
        duration: log.duration,
        date: getFormattedDate(log.date)
      };

      res.json(result);
    }
  );
});

app.get("/api/exercise/log:userId", (req, res) => {
  const { from, to, limit, userId } = req.query;

  User.findById(userId, (err, userData) => {
    if (userData) {
      userData.count = userData.log.length;
      userData.log.forEach(log => (log.date = getFormattedDate(log.date)));
      res.json(userData);
    } else res.send(err);
  });
});

// Not found middleware
app.use((req, res, next) => {
  return next({ status: 404, message: "not found" });
});

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || "Internal Server Error";
  }
  res
    .status(errCode)
    .type("txt")
    .send(errMessage);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
