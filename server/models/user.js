const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const bcrypt = require("bcryptjs");

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
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString(); //Generate access token for user.

  user.tokens = user.tokens.concat([{access, token}]);

  //This code may cause exceptions. Instead we are using concat
  //user.tokens.push({access, token});

  //In order to return the token to be used by the server.js save function,
  //we are using return with user.save for chaining the promise and use in server.js
  return user.save().then(() => {
    return token;
  });
};

//Instance method. We are not using arrow function here because this keyword not support/bind by arrow function
UserSchema.methods.removeToken = function(token) {
  var user = this;

  //call update to remove token and update user collection
  return user.update({

    //$pull is used to remove item from an item array that matches criteria
    $pull: {
      tokens: {token} //in this case it is matching token inside tokens array
    }
  });
};

//Model method starts with "statics" unlike instance method that starts with "methods"
UserSchema.statics.findByToken = function(token) {
  var User = this;
  var decoded;

  try{
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  }
  catch(e){
    // return new Promise((resolve, reject) => {
    //   reject();
    // };
    return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });
};

//Model method
UserSchema.statics.findByCredentials = function(credentials) {
  var User = this;

  return User.findOne({email: credentials.email}).then((user) => {

    if(!user){
      return Promise.reject(); //this reject will call exception in the caller function
    }

    //we have to use new Promise here because we have to use hash password and it does not support default Promise
    return new Promise((resolve, reject) => {

      bcrypt.compare(credentials.password, user.password, (err, result) => {

        if(err) {
          return reject();
        }

        if(result) {
          resolve(user);
        }
        else {
          reject();
        }

      });

    });
  });
};

//Middle ware event of pre saving and it will run before saving a document
UserSchema.pre("save", function (next) {
  var user = this;

  //isModified will check that if before saving document to database the following property is modified or not
  if(user.isModified("password"))
  {
    //Change plain text password with hashed password in model and ready to save it in database
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  }
  else{
    next();
  }
});

//Model for User database object. Collection name will create with Plural like Users
var User = mongoose.model("User", UserSchema);

module.exports = { User };
