var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/TodoApp"); //Create TodoApp database if not exists

module.exports = {mongoose};
//Due to ES6 feature we are shortening it. Otherwise we would have written it as
// module.exports = {
//   mongoose: mongoose
// };
