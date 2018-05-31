//const MongoClient = require('mongodb').MongoClient;
//ES6 Object DeStructuring example
const {MongoClient, ObjectID} = require('mongodb');

//TodoApp is the database name
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

//deleteMany
// db.collection("Todos").deleteMany({text: "Eat lunch"}).then((result) => {
//   console.log(result);
// });

 //deleteOne
 // db.collection("Todos").deleteOne({text: "Eat lunch"}).then((result) => {
 //   console.log(result);
 // });

 //findOneAndDelete
 // db.collection("Todos").findOneAndDelete({text: "Eat lunch"}).then((result) => {
 //   console.log(result);
 // });

 //findOneAndDelete
 db.collection("Users").findOneAndDelete({_id: new ObjectID("5b0f2827d3708d75b7ecbd26")}).
 then((result) => {
    console.log(JSON.stringify(result, undefined, 2));
 });

  db.close();
});
