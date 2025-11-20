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
            res.status(201).send(userInstance);
        })
        .catch((err) =>{
            console.log(err);
            res.status(400).send("Unable to add record: " + err );
        })
    }

});

//route to get users
app.get("/users",(req, res ) => {
    
    user.find({})
    .then( (users) => {
        res.send(users);

    })
    .catch((e) => {
        res.send(e);
    });

});

//route to a user single user
app.get("/users/:id", ( req, res ) => {
    const _id = req.params.id;

    user.findById( _id )
    .then((user) => {
        if(!user){
           return res.status(404).send("No user with given ID");
        }
        res.send(user);
    })
    .catch((e) => {
        res.status(500).send(e);
    })

});


//=== route for adding tasks
app.post("/tasks",(req, res) => {
    console.log("adding a task record/document");
    if(req.body){
        const taskInstance = new task(req.body);
        taskInstance.save()
        .then(() => {
            res.status(201).send(taskInstance);
        })
        .catch((err) =>{
            console.log(err);
            res.status(400).send("Unable to add record: " + err );
        })
    }

});

//---------------------->> route to read all tasks
app.get("/tasks" , (req, res ) => {
    task.find({}).then((tasks) => {
        res.send(tasks);
    })
    .catch((e) => { res.status(500).send(e)});
});

//----------------------->> route to read on task
app.get("/tasks/:id", (req, res ) => {
    const _id = req.params.id;

    task.findById(_id).then((oneTask) => {
        if(!oneTask){
            return res.status(404).send("No task found with a given id");
        }
        res.send(oneTask);
    })
    .catch((e) => {
        res.status(500).send(e);
    })

});

app.listen(port, () =>{
  console.log("Server running on port: ", port);
});
