const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("mongodb");

var {app} = require("./../server.js");
var {Todo} = require("./../models/todo.js");

//For GET todos test
const todos =[{
  _id: new ObjectID(),
  "text": "test todo 1"
},{
  _id: new ObjectID(),
  "text": "test todo 2",
  completed: true,
  completedAt: 333
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

describe("GET /todos/:id", () => {

  it("should return todo by id", (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it("should return 404 if todo not found", (done) => {

    var hexId = new ObjectID().toHexString();

    request(app)
    .get(`/todos/${hexId}`)
    .expect(404)
    .end(done);
  });

  it("should return 404 for non-object ids", (done) => {
    request(app)
    .get("/todos/1234")
    .expect(404)
    .end(done);
  });
});

describe("DELETE todos/:id", () => {
  it("should remove a todo", (done) => {

    var hexId = todos[1]._id.toHexString(); //delete the second todo from array

    request(app)
    .delete(`/todos/${hexId}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(hexId);
    })
    .end((err, res) => {

      if(err){
        return done(err);
      }

      Todo.findById(hexId).then((todo) => {
        expect(todo).toNotExist();
        done();
      }).catch((e) => {
        done(e);
      });
    });
  });

  it("should return 404 if todo not found", (done) => {

    var hexId = new ObjectID().toHexString();

    request(app)
    .delete(`/todos/${hexId}`)
    .expect(404)
    .end(done);
  });

  it("should return 404 for object id is invalid", (done) => {
    request(app)
    .delete("/todos/1234")
    .expect(404)
    .end(done);
  });
});

describe("PATCH todos/:id", () => {
  it("should update the todo", (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = "This should be the new text";

    request(app)
    .patch(`/todos/${hexId}`)
    .send({
      completed: true,
      text
    })
    .expect(200)
    .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
    })
    .end(done);
  });

  it("should clear completedAt when todo is not completed", (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = "This should be the new text foor not completed todo";

    request(app)
    .patch(`/todos/${hexId}`)
    .send({
      completed: false,
      text
    })
    .expect(200)
    .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
    })
    .end(done);
  });
});
