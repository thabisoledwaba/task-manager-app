import mongoose from "mongoose";

await mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api");

// const user = mongoose.model('users',{ 
//     name: {type: String} ,
//     age:{type: Number}
// });

// const userInstance = new user({ 
//     name : "Thabo",
//     age : 36
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

//creating model for tasks 
const tasksModel = mongoose.model('tasks', {
    description:{type: String},
    done:{type: Boolean}
});

//creating an instance of tasks model
const tasksInstance = new tasksModel({
    description: "apply for node dev work",
    done: false
});

//save the instance to database
await tasksInstance.save()
.then(console.log(tasksInstance))
.catch(console.error)
.finally(  () => {
        mongoose.disconnect();
    }
)