const expect = require("expect");
const request = require("supertest");

var {app} = require("./../server.js");
var {Todo} = require("./../models/todo.js");

//Make sure to run test case we are emptying the collection
beforeEach((done) => {
  Todo.remove({}).then(() => {
    done();
  });
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
        Todo.find().then((todos) => {
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
        expect(todos.length).toBe(0);
        done();
      }).catch((e) => {
        done(e);
      });
    });
  });
});
