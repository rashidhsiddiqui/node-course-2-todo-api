var mongoose = require("mongoose");

//Model for User database object. Collection name will create with Plural like Users
var User = mongoose.model("User",
{
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 1
    }
}
);

module.exports = { User };
