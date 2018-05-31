//const MongoClient = require('mongodb').MongoClient;
//ES6 Object DeStructuring example
const {MongoClient, ObjectID} = require('mongodb');

//TodoApp is the database name
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log('Unable to connect to MongoDB server', err);
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

//Find the particular document from collection
// db.collection('Todos').find(
//   {
//     _id: new ObjectID("5b0f22dbd3708d75b7ecbc30")
//   }).toArray().then((docs) => {
//   console.log(JSON.stringify(docs, undefined, 2));
// });

//Find the documents count from collection
// db.collection('Todos').find().count().then((count) => {
//   console.log(`There are ${count} documents in 'Todos' collection.`);
// });

//Find the particular document from collection
db.collection('Users').find(
  {
    name: "Arif"
  }).toArray().then((users) => {
  console.log(JSON.stringify(users, undefined, 2));
});

  db.close();
});
