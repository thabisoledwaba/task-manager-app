import mongoose from "mongoose";
import "../src/db/mongoose.js";
import user from "../src/models/user.js";

// user.findByIdAndUpdate("690f30556734e1de147962d9", {name : "Thabisos"}).then((result) => {
//     console.log(result);
//     return user.countDocuments( { age: {$lte : 20}  });
// }).then((result) => {
//     console.log("Users with age of 36 are :", result);
// }).catch((e) => {
//     console.log(e);
// }).finally(()=>{
//     mongoose.disconnect();
// });


// using async and await

const findUserByIdandUpdate = async (id, age) => {
    await user.findByIdAndUpdate(id, {age} );
    const count  = await user.countDocuments({age});

    return count;
};

const age = 20;
const id = "690f30556734e1de147962d9";

findUserByIdandUpdate(id,age).then((result) => {
    console.log("Users with age :" + age + " are: " + result);
}).catch((e) => {
    console.log(e);
}).finally(() =>{
    mongoose.disconnect();
})