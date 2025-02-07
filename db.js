const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    email: { 
        type: String, 
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const Todo = new Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: String,
    done: Boolean
})

const UserModel = mongoose.model('users', User)
const TodoModel = mongoose.model('todos', Todo)

module.exports = ({UserModel, TodoModel})