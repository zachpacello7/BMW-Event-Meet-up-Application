const express = require("express");
const controller = require("../Controllers/bmwController");
const {isLoggedIn, isHost} = require("../middlewares/auth");

const router = express.Router();

router.get("/", controller.index);

router.get("/new", isLoggedIn, controller.new);

router.post("/", isLoggedIn,  controller.create);

router.get("/:id", controller.bmw);

router.get("/:id/edit",isLoggedIn, isHost, controller.edit);

router.put("/:id",isLoggedIn, isHost, controller.update);

router.delete("/:id",isLoggedIn, isHost, controller.delete);

module.exports =router;