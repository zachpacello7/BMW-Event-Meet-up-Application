const { Model } = require("mongoose");
const{validationResult} = require("express-validator");
const User = require("../Models/user");
const bmw = require("../Models/bmw");
const rsvp = require("../Models/rsvp");
exports.signup = (req, res) => {
    return res.render("./static/signup");
}
exports.loginUser = (req, res) => {
    return res.render("./static/login");
}
exports.login = (req, res, next) => {
    let user = new User(req.body);
    user.save()
        .then(result => {
            req.flash("Success", "Successful signup ");

            res.redirect("/beamer/loginUser");
        })
        .catch(err => {
            if (err.name === "ValidationError") {
                req.flash("Error", err.message);
                return res.redirect("/beamer/signup");
            }
            if (err.code === 11000) {
                req.flash("Error", "Email address has already been used");
                return res.redirect("/beamer/signup");
            }
            next(err);
        });
}
exports.profile = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error=>{
            req.flash("Error", error.msg);
        });
        return res.redirect("back");
    }
    let email = req.body.email;
    if (email)
        email = email.toLowerCase();
    let password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                user.comparePassword(password)
                    .then(result => {
                        if (result) {
                            req.session.user = user._id;
                            req.session.hostName = user.firstName + " " + user.lastName;
                            console.log(req.session.hostName);
                            req.flash("Success", "You have successfully logged in")
                            res.redirect("/beamer/profile");
                        }
                        else {
                            console.log("Wrong password");
                            req.flash("Error", "Wrong password")
                            res.redirect("/beamer/loginUser");
                        }
                    })
            }
            else {
                console.log("Wrong email address");
                req.flash("Error", "Wrong email")
                res.redirect("/beamer/loginUser");
            }
        })
        .catch(err => next(err));
}
exports.profileYes = (req, res, next) => {
    console.log(req.body);
    let userId = "";
    rsvp.findOne({ title: req.session.beamerObject.name }, { attendee: req.session.user })
        .then(result => {
            if (result) {
                console.log(result._id + " ");
                req.session.beamerObject.rsvp = req.body.rsvp;
                rsvp.findByIdAndUpdate({ _id: result._id }, { rsvp: req.body.rsvp }, { useFindAndModify: false })
                    .then(result => {
                        if (result) {
                            req.session.beamerObject.rsvp = req.body.rsvp;
                            console.log("hello" + req.session.beamerObject.rsvp);
                            console.log("hello" + result);

                        }
                        else {
                            console.log("error");
                        }
                        res.redirect("/beamer/profile");
                    })
                    .catch(err => {
                        if (err.status == 500) {
                            console.log(err.message);
                        }
                        console.log(err.message);

                        next(err);
                    });
            }
            else {
                console.log("fail");
                let beamer = new rsvp(req.body);
                beamer.author = req.session.beamerObject.hostName.firstName;
                beamer.title = req.session.beamerObject.name;
                beamer.category = req.session.beamerObject.topic;
                beamer.attendee = req.session.user;
                beamer.postId = req.session.beamerObject._id;
                req.session.rsvpObject = beamer;
                beamer.save()
                    .then(() => {
                        res.redirect("/beamer/profile");
                    })
                    .catch(err => {
                        if (err.status === 500) {
                            console.log(err.message);
                        }
                        console.log(err.message);

                        next(err);
                    });
            }
        })
        .catch(err => next(err));
}
exports.profileNo = (req, res, next) => {
    console.log(req.body);
    rsvp.findOne({ title: req.session.beamerObject.name }, { attendee: req.session.user })
        .then(result => {
            if (result) {
                console.log(result._id + " ");
                req.session.beamerObject.rsvp = req.body.rsvp;
                rsvp.findByIdAndUpdate({ _id: result._id }, { rsvp: req.body.rsvp }, { useFindAndModify: false })
                    .then(result => {
                        if (result) {
                            req.session.beamerObject.rsvp = req.body.rsvp;
                            console.log("hello" + req.session.beamerObject.rsvp);
                            console.log("hello" + result);
                        }
                        else {
                            console.log("error");
                        }
                        res.redirect("/beamer/profile");
                    })
                    .catch(err => {
                        if (err.status == 500) {
                            console.log(err.message);
                        }
                        console.log(err.message);

                        next(err);
                    });
            }
            else {
                console.log("fail");
                let beamer = new rsvp(req.body);
                beamer.author = req.session.beamerObject.hostName.firstName;
                beamer.title = req.session.beamerObject.name;
                beamer.category = req.session.beamerObject.topic;
                beamer.attendee = req.session.user;
                beamer.postId = req.session.beamerObject._id;
                req.session.rsvpObject = beamer;
                beamer.save()
                    .then(() => {
                        res.redirect("/beamer/profile");
                    })
                    .catch(err => {
                        if (err.status === 500) {
                            console.log(err.message);
                        }
                        console.log(err.message);

                        next(err);
                    });
            }
        })
        .catch(err => next(err));
}
exports.profileMaybe = (req, res, next) => {
    console.log(req.body);
    rsvp.findOne({ title: req.session.beamerObject.name }, { attendee: req.session.user })
        .then(result => {
            if (result) {
                console.log(result._id + " ");
                req.session.beamerObject.rsvp = req.body.rsvp;
                rsvp.findByIdAndUpdate({ _id: result._id }, { rsvp: req.body.rsvp }, { useFindAndModify: false })
                    .then(result => {
                        if (result) {
                            req.session.beamerObject.rsvp = req.body.rsvp;
                            console.log("hello" + req.session.beamerObject.rsvp);
                            console.log("hello" + result);
                        }
                        else {
                            console.log("error");
                        }
                        res.redirect("/beamer/profile");
                    })
                    .catch(err => {
                        if (err.status == 500) {
                            console.log(err.message);
                        }
                        console.log(err.message);

                        next(err);
                    });
            }
            else {
                console.log("fail");
                let beamer = new rsvp(req.body);
                beamer.author = req.session.beamerObject.hostName.firstName;
                beamer.title = req.session.beamerObject.name;
                beamer.category = req.session.beamerObject.topic;
                beamer.attendee = req.session.user;
                beamer.postId = req.session.beamerObject._id;
                req.session.rsvpObject = beamer;
                beamer.save()
                    .then(() => {
                        res.redirect("/beamer/profile");
                    })
                    .catch(err => {
                        if (err.status === 500) {
                            console.log(err.message);
                        }
                        console.log(err.message);

                        next(err);
                    });
            }
        })
        .catch(err => next(err));
}
exports.userProfile = (req, res, next) => {
    let id = req.session.user;
    Promise.all([User.findById(id), bmw.find({ hostName: id }), rsvp.find({ attendee: req.session.user })])
        .then(results => {
            const [user, bmw, rsvp] = results;
            res.render("./bmw/profile", { user, bmw, rsvp });

        })
        .catch(err => {
            console.log(err.message);
            next(err)
        });
}
exports.deleteRsvp = (req, res, next) => {
    let body = req.body;
    let user = req.session.user;
    let userTitle = body.title
    console.log(body.title);
    rsvp.findOneAndDelete({ title: userTitle, attendee: user })
        .then(result => {
            if (result) {
                res.redirect("/beamer/profile");
            }
            else {
            }
        })
        .catch(err => next(err));
}
exports.signout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            return next(err);
        }
        else {
            //req.flash("Success", "Successfully Logged out ");

            res.redirect("/beamer/loginUser");
        }
    })
}
exports.about = (req, res) => {
    res.render("./bmw/about");
};
exports.contact = (req, res) => {
    res.render("./bmw/contact");
}
