const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authorization = req.get('Authorization')
    if(!authorization){
        const error = new Error('Not Authorization')
        error.statusCode = 401
        throw error
    }
    const token = authorization.split(' ')[1]
    let decodedToken
    try{
        decodedToken = jwt.verify(token, 'somesupersecret')
    } catch (err) {
        err.statusCode = 500
        throw err
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated')
        error.statusCode = 401
        throw error
    }
    req.userId = decodedToken.userId
    next()
}