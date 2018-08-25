const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");

var message = "I am User number 3";
var hash = SHA256(message).toString();

console.log(`Message is: ${message}`);
console.log(`Hash is: ${hash}`);

var data = {
  id: 4
};

var token = jwt.sign(data, "abc123");
console.log(token);

var decoded = jwt.verify(token, "abc123");
console.log("decoded", decoded);

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
