const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
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

const todoSchema = new Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    done: {
        type: Boolean,
        required: true,
    }
})

const userModel = mongoose.model('users', userSchema)
const todoModel = mongoose.model('todos', todoSchema)

module.exports = ({userModel, todoModel})