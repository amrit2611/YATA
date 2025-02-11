const { Router } = require('express');
const { userModel } = require('../models');
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
        return res.json({
            message: "Incorrect format",
            error: parsedDataWithSuccess.error
        });
    } else {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const username = req.body.username;
            const hashedpassword = await bcrypt.hash(password, 11)
            console.log(`hashed password for this user: ${hashedpassword}`)
            const user = await userModel.create({
                email: email,
                username: username,
                password: hashedpassword
            })
            console.log(`user created: ${user._id}`)
            return res.status(200).json({
                message: 'user created successfully',
                userId: user._id
            })
        } catch (err) {
            return res.status(500).json({
                message: 'error creating user',
                error: err.message
            })
        }
    }
})


userRouter.post('/signin', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await userModel.findOne({
            email: email,
        })
        if (!user) {
            return res.status(403).json({
                message: 'invalid credentials',
            })
        }
        const passwordMatched = bcrypt.compare(password, user.password);
        if (passwordMatched) {
            console.log(user.password)
            const token = jwt.sign({
                id: user._id
            }, ACCESS, {
                expiresIn: '30m'
            });

            res.cookie('access', token, {
                httpOnly: true,
                sameSite: 'Strict',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 30 * 60 * 1000,
                path: '/'
            });

            return res.status(200).json({
                message: "successfullly signed in"
            })
        } else {
            return res.status(403).json({
                message: "invalid credentials"
            });
        }
    } catch (err) {
        return res.status(500).json({
            message: 'error while signing in',
            error: err.message
        })
    }
})


userVerifiedRouter.post

module.exports = {
    userRouter: userRouter
}