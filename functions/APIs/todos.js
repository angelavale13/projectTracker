//Write API to fetch data
const {db} = require('../util/admin');

//fetching all todos from the database and fwd to the client in a list
exports.getAllTodos = (request, response) => {
    db
        .collection('todos')
        .orderBy('createdAt', 'desc')
        .get()
        .then((data) => {
            let todos = [];
            data.forEach((doc) => {
                todos.push({
                    todoId: doc.id,
                    title: doc.data().title,
                    body: doc.data().body,
                    createdAt: doc.data().createdAt,
                });
            });
            return response.json(todos);
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({error: err.code});
        });
};

//Add new method postOneTodo, we are adding a new Todo to our database.
 

exports.postOneTodo = (request, response) => {
    //If elements of our body are empty, then return response 400
	if (request.body.body.trim() === '') {
		return response.status(400).json({ body: 'Must not be empty' });
    }
    
    if(request.body.title.trim() === '') {
        return response.status(400).json({ title: 'Must not be empty' });
    }
    
    const newTodoItem = {
        title: request.body.title,
        body: request.body.body,
        createdAt: new Date().toISOString()
    }
    db
    //or else we add the data
        .collection('todos')
        .add(newTodoItem)
        .then((doc)=>{
            const responseTodoItem = newTodoItem;
            responseTodoItem.id = doc.id;
            return response.json(responseTodoItem);
        })
        .catch((err) => {
			response.status(500).json({ error: 'Something went wrong' });
			console.error(err);
		});
};

//In this method we are deleting a Todo from our database
exports.deleteTodo = (request, response) => {
    const document = db.doc(`/todos/${request.params.todoId}`);
    document
    .get()
    .then((doc) => {
        if (!doc.exists) {
            return response.status(404).json({error: 'Todo not found'})
        }
        return document.delete();
    })
    .then(() => {
        response.json({message: 'Delete successful'});
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({error:err.code});
    });
};

//In this method we are editing a Todo from our database
exports.editTodo = ( request, response) => {
    //Not allowing user to edit the ID or createdAt fields
    if(request.body.todoId || request.body.createdAt){
        response.status(403).json({message: 'Not allowed to edit'});
    }
    let document = db.collection('todos').doc(`${request.params.todoId}`);
    document.update(request.body)
    .then(()=> {
        response.json({message: 'Updated successfully'});
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({
            error: err.code
        });
    });
};