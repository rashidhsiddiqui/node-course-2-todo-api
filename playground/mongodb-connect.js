//const MongoClient = require('mongodb').MongoClient;
//ES6 Object DeStructuring example
const {MongoClient, ObjectID} = require('mongodb');
var obj = new ObjectID(); //Generate new ObjectID for unique value
console.log(obj);

//TodoApp is the database name
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB server');
  }
  console.log('Connected to MongoDB server');

 // db.collection('Todos').insertOne({
 //   text: 'Something to do',
 //   completed: false
 // }, (err, result) => {
 //   if(err){
 //     return console.log('Unable to insert todo', err);
 //   }
 //
 //   console.log(JSON.stringify(result.ops, undefined, 2)); //2 is tab space
 // });

//Collection: Table
//Document: Row
//Field: Column

 db.collection('Users').insertOne({
   name: 'Rashid',
   age: 35,
   location: 'Karachi'
 }, (err, result) => {
   if(err){
     return console.log('Unable to insert user', err);
   }
   //result.ops = list of all records
   console.log(JSON.stringify(result.ops, undefined, 2)); //2 is tab space
 });

  db.close();
});
