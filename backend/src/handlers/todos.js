const { response } = require("express");
const {Router} = require("express");
const {getDBHandler} = require("../lib/db");

const RequestHandler = Router();

RequestHandler.post("/to-dos", async (request, response) => {
    try {
        const dbHandler = await getDBHandler();
        const {title, description, isDone: is_done} = request.body;

        const createionInfo = await dbHandler.run(`
        INSERT INTO todos (title, description, is_done)
        VALUES (
            "${title}",
            "${description}",
            ${is_done}
        )
        `);

        dbHandler.close();

        response.send({
            todoAdded: {
                title, 
                description,
                is_done,
            },
            createionInfo,
        });
    } catch (error) {
        response.status(500).send({
        errorMessage:"There was an unexpected error trying to create a new to do",
        errorDetails: error,});
    }
});

RequestHandler.get("/to-dos", async (request, response, next)=>{
    try {
        const dbHandler = await getDBHandler();
        const todos = await dbHandler.all("SELECT * FROM  todos");

        if(!todos){
            response.status(404).send({message:"To dos not found"});
            next();
        }

        dbHandler.close();

        response.send({todos});
    } catch (error) {
        response.status(500).send({
            errorMessage:"There was an unexpected error trying to get the  to dos",
            errorDetails: error,});
    }
});

RequestHandler.delete("/to-dos/:id", async(request, response)=>{
    try {
        const dbHandler = await getDBHandler();
        const todoId = request.params.id;

        const deletedTodo = await dbHandler.run(`
        DELETE FROM todos WHERE id = ?`,
        todoId);

        dbHandler.close();

        response.send(deletedTodo);
    } catch (error) {
        response.status(500).send({
            errorMessage:"There was an unexpected error trying to delete the to do",
            errorDetails: error,});
    }
});


RequestHandler.patch("/to-dos/:id", async(request, response, next)=>{
    try {
        const dbHandler = await getDBHandler();
        const {title, description, isDone: is_done} = request.body;
        const todoId = request.params.id;

        const updatedTodo = await dbHandler.run(`
        UPDATE todos SET title = "${title}", description = "${description}", is_done = ${is_done}
        WHERE id = ?`,
        todoId);

        
        dbHandler.close();

        response.send({
            todoUpdated: {
                title, 
                description,
                is_done,
            },
            updatedTodo,
        });
    } catch (error) {
        response.status(500).send({
            errorMessage:"There was an unexpected error trying to update the to do",
            errorDetails: error,});
            console.log(error);
    }    
});
module.exports = RequestHandler;