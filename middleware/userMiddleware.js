const jwt = require('jsonwebtoken');
require('dotenv').config()

function userMiddleware(req, res, next) {
    const token = req.cookies.access;
    if (!token){
        return res.status(401).json({
            message: "sign in to continue"
        });
    }
    try {
        const decodedata = jwt.verify(token, process.env.ACCESS_SECRET);
        if (decodedata) {
            req.userId = decodedata.id;
            next();
        } else {
            return res.status(403).json({ 
                message: "authentication failed"
            })
        }
    } catch (err) {
        return res.status(403).json({
            error: err.message 
        })
    }
}

module.exports = {
    userMiddleware: userMiddleware
}