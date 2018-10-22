var env = process.env.NODE_ENV || "development";

if(env.toString().trim() === "development" || env.toString().trim() === "test")
{
  var config = require("./config.json");
  var envConfig = config[env.toString().trim()];

  //Iterate on each environment variable set in config.json file
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}

// if (env.toString().trim() === "development") {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp";
// } else if (env.toString().trim() === "test") {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = "mongodb://localhost:27017/TodoAppTest";
// }
