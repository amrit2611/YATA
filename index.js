const bcrypt = require('bcrypt')
const { z } = require('zod')
const express = require('express')
const { UserModel, TodoModel } = require('./db')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

require('dotenv').config()

const MONGO_CONN_STRING = process.env.MONGO_CONN_STRING
const JWT_SECRET = process.env.JWT_SECRET
const app = express();
app.use(express.json()); // can't parse the req.body without this
mongoose.connect(MONGO_CONN_STRING)

// middleware
function logger(req, res, next) {
    console.log(req.method + ' method was called');
    next();
}

function auth(req, res, next) {
    const token = req.headers.token;
    const decodedata = jwt.verify(token, JWT_SECRET);
    if (decodedata) {
        req.userId = decodedata.id;
        next();
    } else {
        res.status(403).json({ message: "Ivalid credentials" })
    }
}

//routes
app.post('/signup', logger, async (req, res) => {
    const requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(6).max(100),
        name: z.string().min(3).max(100)
    })
    const parsedDataWithSuccess = requiredBody.safeParse(req.body);
    console.log(parsedDataWithSuccess)
    if (!parsedDataWithSuccess.success) {
        res.json({
            message: "Incorrect format",
            error: parsedDataWithSuccess.error
        })
        return;
    }

    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    const hashedpassword = await bcrypt.hash(password, 11)
    console.log(hashedpassword)

    await UserModel.create({
        email: email,
        name: name,
        password: hashedpassword
    })

    res.json({
        message: "You have successfully signed up"
    })
    console.log("you have successfully signed up");
})

app.post('/signin', logger, async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await UserModel.findOne({
        email: email
    })
    if (!user) { res.status(403).json({ message: "User does not exist in our database" }); return; }

    const passwordMatched = bcrypt.compare(password, user.password);

    if (passwordMatched) {
        console.log(user.password)
        const token = jwt.sign({
            id: user._id
        }, JWT_SECRET)
        res.json({
            "token": token
        })
    } else {
        res.status(403).json({ message: "Incorrect Credentials" });
    }
})

// creating todos
app.post('/todo', logger, auth, async (req, res) => {
    const userId = req.userId;
    const title = req.body.title;
    const done = req.body.done;

    await TodoModel.create({
        userId: userId,
        title: title,
        done: done
    });

    res.json({ message: 'Todo created!!' })
})

//
app.get('/todos', logger, auth, async (req, res) => {
    const userId = req.userId;

    const todos = await TodoModel.find({
        userId: userId
    })

    res.json({ todos })
})

app.listen(3000)
console.log("Listening on port 3000")