const { Router } = require('express');
const { userModel } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const { z } = require('zod');


require('dotenv').config();
const userRouter = Router();
const userVerifiedRouter = Router();
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
    if (!email || !password) {
        return res.status(400).json({
            message: "both email and password are required",
        })
    }
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
            console.log(`password matched: ${user.password}`)
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


userVerifiedRouter.post('/logout', async (req, res) => {
    try {
        res.clearCookie('access', {
            httpOnly: true,
            sameSite: 'Strict',
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        });
        return res.status(200).json({
            message: "successfully logged out"
        });
    } catch (err) {
        return res.status(500).json({
            message: "error logging out",
            error: err.message
        })
    }
});


userVerifiedRouter.put('/update', async (req, res) => {
    const newPassword = req.body.newPassword;
    const userId = req.userId;
    if (!newPassword) { // should also return if newpassword is === old password
        return res.json({
            message: "a new password is required"
        })
    } else {
        try {
            const newHashedPassword = await bcrypt.hash(newPassword, 11);
            const updatedUser = await userModel.findOneAndUpdate({
                _id: userId
            }, {
                password: newHashedPassword,
            }, { new: true });
            return res.status(200).json({
                message: "password has been updated",
                userId: updatedUser._id
            })
        } catch (err) {
            return res.status(500).json({
                message: "there was an issue while updating password",
                error: err.message
            })
        }
    }
})

module.exports = {
    userRouter: userRouter,
    userVerifiedRouter: userVerifiedRouter
}