var express = require("express");
var bodyParser = require("body-parser");

//Local libraries
var {mongoose} = require("./db/mongoose.js");
var {Todo} = require("./models/todo.js");
var {User} = require("./models/user.js");

var app = express();

//Use body Parser to parse the request in JSON
app.use(bodyParser.json());

//POST todos
app.post("/todos", (req, res) => {
  var todo = new Todo({
    text: req.body.text //taking text from request body
  });

  todo.save().then((doc) => {
    res.status(200).send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

//GET todos
app.get("/todos", (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.listen(3000, () => {
  console.log("Started listening to port 3000");
});

module.exports = { app };

// var newTodo = new Todo({
//   text: "Some work to do",
//   completed: false
// });
//
// //Save Document in Collection
// newTodo.save().then((doc) => {
//   console.log("Saved Todo ", doc);
// }, (err) => {
//   console.log("Error Saving Todo ", err);
// });

// var anotherTodo = new Todo({
//   text: "",
//   completed: true,
//   completedAt: 123
// });
//
// //Save Document in Collection
// anotherTodo.save().then((doc) => {
//   console.log("Saved Todo ", doc);
// }, (err) => {
//   console.log("Error Saving Todo ", err);
// });

// var newUser = new User({
//   email: "test@test.com"
// });
//
// //Save Document in Collection
// newUser.save().then((doc) => {
//   console.log("Saved User ", doc);
// }, (err) => {
//   console.log("Error Saving User ", err);
// });

// var anotherTodo = new Todo({
//   text: "",
//   completed: true,
//   completedAt: 123
// });
//
// //Save Document in Collection
// anotherTodo.save().then((doc) => {
//   console.log("Saved Todo ", doc);
// }, (err) => {
//   console.log("Error Saving Todo ", err);
// });
