const {ObjectID} = require("mongodb");

const {mongoose} = require("./../server/db/mongoose.js");
const {Todo} = require("./../server/models/todo.js");
const {User} = require("./../server/models/user.js");

// Todo.findOneAndRemove({_id: "5b1ee7f375c49b34e0977dd3"}).then((todo) => {
//   console.log(`Todo removed: ${todo}`);
// }).catch((e) => {
//   console.log("Error in removing Todo: " + e);
// });

Todo.findByIdAndRemove("5b1ee7f375c49b34e0977dd4").then((todo) => {
  console.log(`Todo removed: ${todo}`);
}).catch((e) => {
  console.log("Error in removing Todo: " + e);
});
