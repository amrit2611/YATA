const cors = require('cors');
const express = require('express')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { todoRouter } = require('./routes/todoRouter');
const { userMiddleware } = require('./middleware/userMiddleware');
const { userRouter, userVerifiedRouter } = require('./routes/userRouter');


const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
require('dotenv').config()


app.use('/home', userRouter);
app.use('/api/v1/user', userMiddleware, userVerifiedRouter)
app.use('/api/v1/todo', userMiddleware, todoRouter);


async function main() {
    try {
        await mongoose.connect(process.env.MONGO_CONN_STRING)
        app.listen(3000)
        console.log("Listening on port 3000")
    } catch (err) {
        console.error(err.message)
    }
}
main();