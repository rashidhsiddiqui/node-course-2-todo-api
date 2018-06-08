const expect = require("expect");
const request = require("supertest");

var {app} = require("./../server.js");
var {Todo} = require("./../models/todo.js");

//For GET todos test
const todos =[{
  "text": "test todo 1"
},{
  "text": "test todo 2"
}];

//Make sure to run test case we are emptying the collection
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos); //seed the data; Mongoose method
  }).then(() => done());
});

describe("POST /todos", () => {
  it("should create a new todo", (done) => {
    var text = "create a new todo";

    request(app)
    .post("/todos")
    .send({text}) //we could have used text: text but for ES6, we have not
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text); //custom expect from expect library
    })
    .end((err, res) => {
        if(err){
          return done(err);
        }

        //find if todo inserted
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1); //should be only one todo in collection
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => {
          done(e);
        });
    });
  });

  it("should not create todo with invalid body data", (done) => {
    request(app)
    .post("/todos")
    .send({})
    .expect(400)
    .end((err, res) => {
      if(err){
        return done(err);
      }

      Todo.find().then((todos) => {
        expect(todos.length).toBe(2); //should be two todos in collection because of GET has seeded 2 todos
        done();
      }).catch((e) => {
        done(e);
      });
    });
  });
});

describe("GET /todos", () => {

  it("should return all todos", (done) => {
    request(app)
    .get("/todos")
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  });
});
