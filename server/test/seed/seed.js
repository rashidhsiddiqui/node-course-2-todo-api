const {ObjectID} = require("mongodb");
const jwt = require("jsonwebtoken");

const {Todo} = require("./../../models/todo");
const {User} = require("./../../models/user");

//For GET users test
const firstUserID = new ObjectID();
const secondUserID = new ObjectID();
const users =[{
  _id: firstUserID,
  "email": "rashid@test.com",
  "password": "rashidPass",
  tokens: [{
    access: "auth",
    token: jwt.sign({_id: firstUserID, access: "auth"}, "abc123").toString()
  }]
},{
  _id: secondUserID,
  "email": "talha@test.com",
  "password": "talhaPass",
  tokens: [{
    access: "auth",
    token: jwt.sign({_id: secondUserID, access: "auth"}, "abc123").toString()
  }]
}];

//For GET todos test
const todos =[{
  _id: new ObjectID(),
  "text": "test todo 1",
  _creator: firstUserID
},{
  _id: new ObjectID(),
  "text": "test todo 2",
  completed: true,
  completedAt: 333,
  _creator: secondUserID
}];

var populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos); //seed the data; Mongoose method
  }).then(() => done());
};

var populateUsers = (done) => {
  User.remove({}).then(() => {

    //Here we have not used insertMany because of authentication middleware usage
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]) //this return will call then function below

  }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};
