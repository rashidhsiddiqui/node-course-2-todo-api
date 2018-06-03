var mongoose = require("mongoose");

//Model for Todo database object. Collection name will create with Plural like Todos
var Todo = mongoose.model("Todo",
{
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 1
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Number, //Unix based timestamp
      default: null
    }
}
);

module.exports = { Todo };
