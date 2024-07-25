const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const bmwRoutes = require("./Routes/bmwRoutes");
const staticRoutes = require("./Routes/staticRoutes");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const app = express();

let port = 8080;
let host = "localhost";

app.set("view engine","ejs");

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(morgan("tiny"));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost:27017/BMW", { useNewUrlParser: true,  useUnifiedTopology: true })
.then(()=>{
    app.listen(port,host,()=>{
        console.log("Server is running on port "+port);
    });
})
.catch(err=>console.log(err.message));
app.use(session({
    secret:"as;ldkjfja;dlfkj",
    resave:false,
    saveUninitialized:false,
    cookie:{maxAge:60*60*1000},
    store:new MongoStore({mongoUrl:"mongodb://localhost:27017/BMW"})
}));
app.use(flash());

app.use((req, res, next)=>{
    console.log(res.locals.user)
    console.log(res.locals.users)
    res.locals.user = req.session.user||null;
    res.locals.users = req.session.hostName|| null;
    res.locals.successMessages= req.flash("Success");
    res.locals.errorMessages= req.flash("Error");
    next();
})
app.get("/",(req,res)=>{
    res.render("index");
});
app.use("/bmw",bmwRoutes);
app.use("/beamer",staticRoutes);
app.use((req,res,next)=>{
    let err = new Error("The server cannot locate "+req.url);
    err.status = 404;
    next(err);
});

