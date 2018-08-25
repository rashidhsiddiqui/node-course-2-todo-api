const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

var UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      unique: true,
      validate: {
          validator: validator.isEmail,
          message: "{VALUE} is not a valid email"
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    tokens: [{
      access: {
        type: String,
        required: true
      },
      token: {
        type: String,
        required: true
      }
    }]
});

//Override method for returning only required set of properties
UserSchema.methods.toJSON = function() {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ["_id", "email"]);
};

//Instance methods. We are not using arrow function here because this keyword not support/bind by arrow function
UserSchema.methods.generateAuthToken = function() {
  var user = this;
  var access = "auth";
  var token = jwt.sign({_id: user._id.toHexString(), access}, "abc123").toString(); //Generate access token for user.

  user.tokens = user.tokens.concat([{access, token}]);

  //This code may cause exceptions. Instead we are using concat
  //user.tokens.push({access, token});

  //In order to return the toen to be used by the server.js save function,
  //we are using return with user.save for chaining the promise
  return user.save().then(() => {
    return token;
  });
};

//Model for User database object. Collection name will create with Plural like Users
var User = mongoose.model("User", UserSchema);

module.exports = { User };
