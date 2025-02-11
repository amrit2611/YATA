const { Router } = require('express');
const { todoModel, userModel } = require('../models');
const { z } = require('zod');

const todoRouter = Router();

// creating todos
todoRouter.post('/create', async (req, res) => {
    const userId = req.userId;
    const title = req.body.title;
    const done = req.body.done;
    // input validation
    try {
        const todo = await todoModel.create({
            userId: userId,
            title: title,
            done: done
        });
        return res.status(200).json({
            message: "todo created",
            todo: todo
        })
    } catch (err) {
        return res.status(500).json({
            message: "error while creating todo",
            error: err.message
        })
    }
})


//fetch todos
todoRouter.get('/get', async (req, res) => {
    const userId = req.userId;
    try {
        const todos = await todoModel.find({
            userId: userId
        })
        return res.status(200).json({
            message: 'todos found for this user',
            todos: todos
        })
    } catch (err) {
        return res.status(500).json({
            message: "error fetching todos",
            error: err.message,
        })
    }
})


// delete todos
todoRouter.delete('/delete/:todoId', async (req, res) => {
    const userId = req.userId;
    const todoId = req.params.todoId;
    console.log(`todoId to delete: ${todoId}`);
    try {
        await todoModel.deleteOne({
            _id: todoId,
            userId: userId
        });
        return res.status(200).json({
            message: "todo deleted"
        })
    } catch (err) {
        return res.status(500).json({
            message: "error while deleting todo", 
            error: err.message
        })
    }
})


module.exports = {
    todoRouter: todoRouter
}