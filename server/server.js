const _ = require("lodash"); //Javascript utility functions library
const express = require("express");
const bodyParser = require("body-parser");
const {ObjectID} = require("mongodb");

const port = process.env.PORT || 3000;

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

//GET todos/id
app.get("/todos/:id", (req, res) => {

  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {

    if(!todo){
      return res.status(404).send();
    }

    res.send({todo});
  }, (e) => {
    res.status(400).send(e);
  });
});

//Delete todos/id
app.delete("/todos/:id", (req, res) => {

  var id = req.params.id;

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {

    if(!todo){
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send(e);
  });
});

//Update todos/id
app.patch("/todos/:id", (req, res) => {
  var id = req.params.id;

  //pick only subset of things 2 properties from request body
  var body = _.pick(req.body, ['text', 'completed']);

  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  //if completed is true from user, then we are setting completedAt to current timestamp
  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }
  else{
    body.completed = false;
    body.completedAt = null;
  }

  //$set will accept the body of model that will update only for the selected id
  Todo.findByIdAndUpdate(id, {$set:body}, {new: true}).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((ex) => {
    res.status(400).send(ex);
  });
});

app.listen(port, () => {
  console.log(`Started listening to port ${port}`);
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
