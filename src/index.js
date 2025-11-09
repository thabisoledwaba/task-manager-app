import express from "express";
import  "./db/mongoose.js";
import user from "./models/user.js";
import task from "./models/task.js";

const app = express();
const port = process.env.port || 3000;

// parse requests to js objects
app.use(express.json());

//=== route for adding users
app.post("/users",(req, res) => {
    console.log("adding a user record/document");
    if(req.body){
        const userInstance = new user(req.body);
        userInstance.save()
        .then(() => {
            res.send(userInstance);
        })
        .catch((err) =>{
            console.log(err);
            res.status(400).send("Unable to add record: " + err );
        })
    }

});


//=== route for adding tasks
app.post("/tasks",(req, res) => {
    console.log("adding a task record/document");
    if(req.body){
        const taskInstance = new task(req.body);
        taskInstance.save()
        .then(() => {
            res.send(taskInstance);
        })
        .catch((err) =>{
            console.log(err);
            res.status(400).send("Unable to add record: " + err );
        })
    }

});

app.listen(port, () =>{
  console.log("Server running on port: ", port);
});
