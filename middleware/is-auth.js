require("dotenv").config();
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authorization = req.get('Authorization')
    if(!authorization){
        const error = new Error('Not Authorization')
        error.statusCode = 401
        throw error
    }
    const token = authorization
    try{
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
        
        if (!decodedToken) {
            const error = new Error('Not authenticated')
            error.statusCode = 401
            throw error
        }
        
        req.user = decodedToken

    } catch (err) {
        err.statusCode = 500
        throw err
    }
    next()
}