const { Router } = require('express');
const { userModel } = require('../db');
const jwt = require('jsonwebtoken');
const { z } = require('zod');


const userRouter = Router();
require('dotenv').config();
const ACCESS = process.env.ACCESS_SECRET;
const REFRESH = process.env.REFRESH_SECRET;


userRouter.post('/signup', async (req, res) => {
    const requiredBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(6).max(100),
        username: z.string().min(3).max(100)
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


userRouter.post('/signin', logger, async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await userModel.findOne({
        email: email
    })
    if (!user) { res.status(403).json({ message: "User does not exist in our database" }); return; }

    const passwordMatched = bcrypt.compare(password, user.password);

    if (passwordMatched) {
        console.log(user.password)
        const token = jwt.sign({
            id: user._id
        }, ACCESS)
        res.json({
            "token": token
        })
    } else {
        res.status(403).json({ message: "Incorrect Credentials" });
    }
})


module.exports = {
    userRouter: userRouter
}