require('./config/config');

const _ = require("lodash"); //Javascript utility functions library
const express = require("express");
const bodyParser = require("body-parser");
const {ObjectID} = require("mongodb");

//Local libraries
var {mongoose} = require("./db/mongoose.js");
var {Todo} = require("./models/todo.js");
var {User} = require("./models/user.js");
var {authenticate} = require("./middleware/authenticate.js");
//
var app = express();
const port = process.env.PORT || 3000;

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

//POST /users
app.post("/users", (req, res) => {

  //pick only subset of things 2 properties from request body
  var body = _.pick(req.body, ['email', 'password']);

  var user = new User({
    email: body.email, //taking text from request body
    password: body.password
  });

  user.save().then((doc) => {

    return user.generateAuthToken(); //it will give back generated token to below then statement
    //res.status(200).send(doc);

  }).then((token) => { //This then statement is for chain promise returning from generateAuthToken function
    res.header("x-auth", token).status(200).send(user); //x- is used for custom header
  }).catch((e) => {
    res.status(400).send(e);
  });
});

//Private route example
//authenticate is behaving like a middleware function
app.get("/users/me", authenticate, (req, res) => { //authenticate is auth middleware function residing inside server/middleware/authenticate.js
  res.send(req.user); //req.user is coming from authenticate middleware
});

//existing user login info
app.post("/users/login", (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body).then((user) => {

    return user.generateAuthToken().then((token) => {
      res.header("x-auth", token).status(200).send(user); //x- is used for custom header
    }).catch((ex) => {
      res.status(400).send(ex);
    });
  }).catch((ex) => {
    res.status(400).send(ex);
  });
});

//Private route - delete token for Logged Out user
app.delete("/users/me/token", authenticate, (req, res) => {
  //Instance method - req.user is coming from authenticate middleware
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(401).send();
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
