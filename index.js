const express = require('express')
const mongoose = require('mongoose');
const { userMiddleware } = require('./middleware/userMiddleware');
const { userRouter } = require('./routes/userRouter');
const { todoRouter } = require('./routes/todoRouter');

require('dotenv').config()
const app = express();
app.use(express.json());

app.use('/home', userRouter);
app.use('api/v1/todo', userMiddleware, todoRouter);

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_CONN_STRING)
        app.listen(3000)
        console.log("Listening on port 3000")
    } catch (err) {
        console.log(err.message)
    }
}

main();