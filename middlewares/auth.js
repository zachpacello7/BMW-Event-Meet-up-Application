const bmw = require("../Models/bmw");
exports.isGuest = (req, res, next )=>{
    if(!req.session.user){
        return next();
    }
    else{
        req.flash("Error", "You are logged in already");
        return res.redirect("/beamer/profile")
    }
}

exports.isLoggedIn = (req, res, next)=>{
    if(req.session.user){
        return next();
    }
    else{
        req.flash("Error", "You need to login first");
        return res.redirect("/beamer/loginUser")
    }
}
exports.isHost = (req, res, next) =>{
    let id = req.params.id; 
    bmw.findById(id)
    .then(bmw=>{
        if(bmw){
            if(bmw.hostName ==req.session.user){
                return next();
            }
            else{
                let error = new Error("Unauthorized acces to the resource");
                error.status = 401;
                return next(error);
            }
        }
    })
    .catch(err=>next(err));
}