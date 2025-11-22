import mongoose from "mongoose";
import "../src/db/mongoose.js";
import user from "../src/models/user.js";

user.findByIdAndUpdate("690f30556734e1de147962d9", {name : "Thabisos"}).then((result) => {
    console.log(result);
    return user.countDocuments( { age: {$lte : 20}  });
}).then((result) => {
    console.log("Users with age of 36 are :", result);
}).catch((e) => {
    console.log(e);
}).finally(()=>{
    mongoose.disconnect();
});