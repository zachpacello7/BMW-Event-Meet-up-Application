const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const beamerSchema = new Schema({
    name: { type: String, required: [true, "Name is required"] },
    topic: { type: String, required: [true, "Topic is required"] },
    details: { type: String, required: [true, "Details are required"], minLength: [10, "Details should have at least 10 characters"] },
    date: { type: String, required: [true, "Date is required"] },
    startTime: { type: String, required: [true, "Start Time is required"] },
    where: { type: String, required: [true, "Where is required"] },
    endTime: { type: String, required: [true, "End Time is required"] },
    hostName: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    image: {type: String, required: [true, "Image is required"]}
},
    { timestamps: true }
);
module.exports = mongoose.model("Beamer", beamerSchema);