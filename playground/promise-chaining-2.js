import mongoose from "mongoose";
import "../src/db/mongoose.js";
import task from "../src/models/task.js";

// task.findByIdAndDelete("690f287a78a0ffeec3b74d6e").then((result) => {
//     console.log(result);
//     return task.countDocuments({done: false});
// }).then((result) => {
//     console.log("Number of incomplete tasks : ", result);
// }).catch((e) => {
//     console.log(e);
// }).finally(()=> {
//     mongoose.disconnect();
// });

//----------------------------using async and await -----------------------------------

const deleteTaskAndCount = async (id) => {
    await task.findByIdAndDelete(id);
    const count = await task.countDocuments({done:false});

    return count;
};

const id = "6910eb9c64643dd066429907";

deleteTaskAndCount(id).then((counter) => {
   console.log("Number of incomplete tasks : ", counter);
}).catch((e) => {
    console.log(e);
}).finally(() => {
    mongoose.disconnect();
})