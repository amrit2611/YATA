const jwt = require('jsonwebtoken');
require('dotenv').config()

function userMiddleware(req, res, next) {
    const token = req.headers.token;
    const decodedata = jwt.verify(token, process.env.JWT_SECRET);
    if (decodedata) {
        req.userId = decodedata.id;
        next();
    } else {
        return res.status(403).json({ 
            message: "authentication failed"
        })
    }
}

module.exports = {
    userMiddleware: userMiddleware
}