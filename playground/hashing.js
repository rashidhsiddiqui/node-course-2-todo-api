const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// var message = "I am User number 3";
// var hash = SHA256(message).toString();
//
// console.log(`Message is: ${message}`);
// console.log(`Hash is: ${hash}`);

var password = "abc123";

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

var hashedPassword = "$2a$10$rRZrZr3ayj4iFv/HxxI8nuRF635KvMOF0fBplUSrkcHTX1Uq5EJl.";

bcrypt.compare(password, hashedPassword, (err, result) => {
  console.log(result);
});

// var data = {
//   id: 4
// };
//
// var token = jwt.sign(data, "abc123");
// console.log(token);
//
// var decoded = jwt.verify(token, "abc123");
// console.log("decoded", decoded);

// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + "some secret").toString()
// };
//
// var resultHash = SHA256(JSON.stringify(token.data) + "some secret").toString();
// if(resultHash === token.hash)
// {
//   console.log("data was not changed");
// }
// else {
//   console.log("data has changed. Do not trust.");
// }
