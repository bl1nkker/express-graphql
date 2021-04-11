const jwt = require('jsonwebtoken')

exports.authMiddleware = (req, res, next) => {
    // Here we get Authorization field (it's look like this: Authorization: "Bearer <user_token>") from request
    const authHeader = req.get('Authorization')
    // If there is no Authorization field then we just dispatch next() with req.isAuth = false (.isAuth - custom prop)
    if (!authHeader){
        req.isAuth = false;
        return next()
    }

    // Authorization: "Bearer <user_token>"
    const token = authHeader.split(" ")[1]

    // If there is no token then we just dispatch next() with req.isAuth = false (.isAuth - custom prop)
    if (!token || token === ''){
        req.isAuth = false;
        return next()
    }

    try {
        // Then we try to decode and verify the user token
        const decodedToken = jwt.verify(token, 'secretkey')
        // If it fails then we just dispatch next() with req.isAuth = false (.isAuth - custom prop)
        if (!decodedToken) {
            req.isAuth = false;
            return next()
        }

        // Else, all fine, req.isAuth = true (.isAuth - custom prop) and also we pass to request userId
        // to use it at the backend (when event/booking created)
        req.isAuth = true
        req.userId = decodedToken.userId
        next()
    } catch (error) {
        req.isAuth = false;
        return next()
    }
    
}