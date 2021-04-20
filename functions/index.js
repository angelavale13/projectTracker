//use cors to tell browser to accept api call
const cors = require('cors');

const functions = require('firebase-functions');
const app = require('express')();
app.use(cors())

const {
    getAllTodos,
    postOneTodo,
    deleteTodo,
    editTodo
} = require('./APIs/todos')

//assigned getAllTodos to the /todos route. 
//All API calls on this route will execute via getAllTodos function.
app.get('/todos', getAllTodos); 

//assign POST route to postOneTodo method
app.post('/todo', postOneTodo);

//assign DELETE route to deleteTodo method
app.delete('/todo/:todoId', deleteTodo);

//assign PUT route to editTodo method
app.put('/todo/:todoId', editTodo);

exports.api = functions.https.onRequest(app);




