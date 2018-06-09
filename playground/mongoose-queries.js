const {ObjectID} = require("mongodb");

const {mongoose} = require("./../server/db/mongoose.js");
const {Todo} = require("./../server/models/todo.js");
const {User} = require("./../server/models/user.js");

var id = "5b13033bae7edea42c2a90ab";

// if(!ObjectID.isValid(id)){
//   console.log("Id not valid");
// }
//
// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log("Todos", todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log("Todo", todo);
// });
//
// Todo.findById(id).then((todo) => {
//   if(!todo){
//       return console.log("Id not found");
//   }
// }).catch((e) => {
//   console.log("Todo by Id", todo);
//  console.log("Error finding todo", e);
//});

User.findById(id).then((user) => {
  if(!user){
      return console.log("User not found");
  }
  console.log("User by Id", user);
}).catch((e) => {
  console.log("Error finding user", e);
});
