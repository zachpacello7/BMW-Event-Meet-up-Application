const { Model } = require("mongoose");
const model = require("../Models/bmw");
const rsvp = require("../Models/rsvp");

exports.index = (req , res, next) => {
    model.find()
    .then(bmw=>{
        res.render("./bmw/index", {bmw});
    })
    .catch(err=>next(err));
};
exports.bmw = (req , res,next) => {
    let size = 0;
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let error = new Error("Invalid id");
        error.status = 400;
        return next(error);
    }
    model.findById(id).populate("hostName")
    .then(bmw=>{
        if(bmw){
            req.session.beamerObject = bmw;
            console.log(req.session.beamerObject.name+" ");
            let yes = "yes";
            rsvp.find({title:bmw.name, rsvp:yes})
            .then(result=>{
                if(result){
                    size = result.length;
                    console.log(size);
                    return res.render("./bmw/event",{bmw, size});
                }
                else{

                }
            })
            .catch(err=>next(err));
        }
        else{
            let err = new Error("Cannot find with id "+id );
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>{
        if(err.name === "ValidationError"){
            err.status = 400;
        }
        if(err.status === 500){
            console.log(err.message);
        }
        next(err);
    });
};
exports.new = (req , res)=>{
    res.render("./bmw/new");
};
exports.create = (req , res, next)=>{
    let bmw = new model(req.body);
    bmw.hostName = req.session.user;
    if(bmw.email)
        bmw.email = bmw.email.toLowerCase();
    bmw.save()
    .then(bmw =>{
        console.log(bmw);
        res.redirect("/bmw");
    })
    .catch(err=>{
        if(err.name === "ValidationError"){
            err.status = 400;
        }
        next(err);
    });
};
exports.edit = (req , res,next)=>{
    let id = req.params.id;
    console.log(id.match(/^[0-9a-fA-F]{24}$/));
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let error = new Error("Invalid id");
        error.status = 400;
        return next(error);
    }
    else{
        model.findById(id)
        .then(bmw=>{
            if(bmw){
               return res.render("./bmw/edit",{bmw});
            }
            else{
                req.flash('Error', err.message);
                return res.redirect('/back');
            }
        })
        .catch(err=>{
            console.log(err.message);
            if(err.name === "ValidationError"){
                console.log("hi");
                req.flash('Error', err.message);
                return res.redirect('back');
            }
            if(err.status === 404){
                req.flash('Error', err.message);
                return res.redirect('back');
            }
            if(err.status === 500){
                console.log(err.message);
            }
            next(err);
        });
    }
};
exports.update = (req , res,next)=>{
    let bmw = req.body;
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let error = new Error("Invalid id");
        error.status = 400;
        return next(error);
    }
    model.findByIdAndUpdate(id, bmw, {useFindAndModify:false, runValidators:true})
    .then(bmw=>{
        if(bmw){
            req.flash("Success", "Updated Successfully");
            res.redirect("/bmw/"+id);
        }
        else{
            let err = new Error("Cannot find with id "+id );
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>{
        console.log(err.message);

        if(err.name === "ValidationError"){
            req.flash('Error', err.message);
            return res.redirect('back');
        }
        next(err);
    });

}
exports.delete = (req,res,next)=>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let error = new Error("Invalid id");
        error.status = 400;
        return next(error);
    }
    model.findByIdAndDelete(id, {useFindAndModify:false})
    .then(bmw=>{
        if(bmw){
            rsvp.remove({title: bmw.name})
            .then(result=>{
                if(result){
                    res.redirect("/bmw");
                }
            })
            .catch(err=>next(err));
        }
        else{
            let err = new Error("Cannot find with id "+id );
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};
