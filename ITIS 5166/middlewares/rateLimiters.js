const rateLimit = require("express-rate-limit");

exports.logInLimiter = rateLimit({
    windowMs:60*1000,
    max:5,
    message:"Too many login requests.  Try again later",
    handler:(req, res, next)=>{
        let error = new Error("Too many login requests. Try again Later");
        error.status = 429;
        return next(error);
    }
});