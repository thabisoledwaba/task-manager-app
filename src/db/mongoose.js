import mongoose from "mongoose";

try{
    await mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api");
}
catch(err){
    console.log("Unable to connect to a database")
}

// const userInstance = new user({ 
//     name : "Thabos",
//     age : 20,
//     password: "Ola123ola",
//     email: "email@we.co.za"
// });

// await userInstance.save()
// .then( () =>{
//     console.log(userInstance);    
// })
// .catch(console.error)
// .finally( () =>{
//     mongoose.disconnect();
// });


//console.log(userInstance);
//users.save().then(()=> { console.log()})

//###########################################################################################

//======creating model for tasks 
// const tasksModel = mongoose.model('tasks', {
//     description:{
//         type: String,
//         //required:true,
//         trim: true,
//         validate(value){
//             if(!value){
//                 throw new Error("Task description has not been supplied");
//             }
//         }
//     },
//     done:{type: Boolean,
//         default: false
//     }
// });

// //===== creating an instance of tasks model
// const tasksInstance = new tasksModel({
//     description: "another task to be loaded as not done",
//     done: false
// });

// //save the instance to database
// await tasksInstance.save()
// .then(console.log(tasksInstance))
// .catch(console.error)
// .finally(  () => {
//         mongoose.disconnect();
//     }
// )