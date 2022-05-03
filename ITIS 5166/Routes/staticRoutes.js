const express = require("express");
const User = require("../Models/user");
const controller = require("../Controllers/staticBmwController");
const {isGuest, isLoggedIn} = require("../middlewares/auth");
const {logInLimiter} = require("../middlewares/rateLimiters");
const {body} = require("express-validator");
const router = express.Router();

router.get("/signup", isGuest, controller.signup);
router.get("/loginUser", isGuest, controller.loginUser);
router.post("/login",isGuest, controller.login);
router.post("/profile",isGuest,logInLimiter,
[body("email", "Email must be a valid email adress").isEmail().trim().escape().normalizeEmail(),
body("pasword", "Password must be at least 8 characters and at most 64 ").isLength({max:64})],
controller.profile);
router.post("/profile/yes", controller.profileYes);
router.post("/profile/no", controller.profileNo);
router.post("/profile/maybe", controller.profileMaybe);
router.get("/profile", isLoggedIn, controller.userProfile);
router.post("/delete/rsvp", controller.deleteRsvp);
router.get("/signout", isLoggedIn, controller.signout);
router.get("/about", controller.about);
router.get("/contact", controller.contact);


module.exports = router;