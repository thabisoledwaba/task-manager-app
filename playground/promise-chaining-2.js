import mongoose from "mongoose";
import "../src/db/mongoose.js";
import task from "../src/models/task.js";

task.findByIdAndDelete("690f287a78a0ffeec3b74d6e").then((result) => {
    console.log(result);
    return task.countDocuments({done: false});
}).then((result) => {
    console.log("Number of incomplete tasks : ", result);
}).catch((e) => {
    console.log(e);
}).finally(()=> {
    mongoose.disconnect();
})