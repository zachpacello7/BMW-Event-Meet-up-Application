const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    rsvp:{type:String},
    title:{type:String},
    category:{type:String},
    author:{type:String},
    attendee:{type:String},
    postId:{type:String}
},
{ timestamps: true }
);
module.exports = mongoose.model("RSVP", rsvpSchema);