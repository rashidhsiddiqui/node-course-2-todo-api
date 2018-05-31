//const MongoClient = require('mongodb').MongoClient;
//ES6 Object DeStructuring example
const {MongoClient, ObjectID} = require('mongodb');

//TodoApp is the database name
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

 //findOneAndUpdate
 db.collection("Users").findOneAndUpdate(
   //filter argument
   {_id: new ObjectID("5b0f27f1d3708d75b7ecbd1f")}
   //set argument
   ,{
     $set: {
       name: "Arif Khan"
     },
     $inc: {
       age: 10
     }
   },
   {
     returnOriginal: false
   }).then((result) => {
    console.log(JSON.stringify(result, undefined, 2));
 });

  db.close();
});
