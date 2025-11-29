import express from "express";
import  "./db/mongoose.js";
import user from "./models/user.js";
import task from "./models/task.js";

const app = express();
const port = process.env.port || 3000;

// parse requests to js objects
app.use(express.json());

//=== route for adding users
app.post("/users", async (req, res) => {

   if(req.body){
    const User = new user(req.body);
    
    try{
        await User.save();
        res.status(201).send(User);
    }catch(e){
        res.status(400).send("Unable to add record: " + e);
    }
   }

    // console.log("adding a user record/document");
    // if(req.body){
    //     const userInstance = new user(req.body);
    //     userInstance.save()
    //     .then(() => {
    //         res.status(201).send(userInstance);
    //     })
    //     .catch((err) =>{
    //         console.log(err);
    //         res.status(400).send("Unable to add record: " + err );
    //     })
    // }

});

//route to get users
app.get("/users", async (req, res ) => {

    try{
        const users = await user.find({});
        res.status(200).send(users);
    }catch(e){
        res.status(400).send();
    };

    //==== this comments code uses promise chaining ====
    // user.find({})
    // .then( (users) => {
    //     res.send(users);

    // })
    // .catch((e) => {
    //     res.send(e);
    // });

});

//==== route to fetch a user single user
app.get("/users/:id", async ( req, res ) => {
    const _id = req.params.id;

    try{
        const userRecord = await user.findById(_id);
        if(!userRecord){
            return res.status(404).send("No user found with a given ID");
        }
        res.send(userRecord);
    }catch(e){
        res.status(500).send(e);
    };

    //====== this code uses promise chaining====
    // user.findById( _id )
    // .then((user) => {
    //     if(!user){
    //        return res.status(404).send("No user with given ID");
    //     }
    //     res.send(user);
    // })
    // .catch((e) => {
    //     res.status(500).send(e);
    // })

});


//======= route to update a user by id
app.patch("/users/:id", async (req, res) => {
    const _id = req.params.id;
    const userData = req.body;

    const updates = Object.keys(userData);
    const allowedOperation = ["name","age","email","password"];
    const isValidOperation = updates.every( (update) => allowedOperation.includes(update) );

    if(!isValidOperation){
        return res.status(400).send({error:"Invalid updates!"});
    }

    try{
        const User = await user.findByIdAndUpdate(_id, userData, { new: true, runValidators: true } );
        if(!User){
            return res.status(404).send("Unsuccesfull Update");
        }
        res.send(User);
    }catch(e){
        res.status(500).send(e);
    };

});


//=== route for adding tasks
app.post("/tasks", async (req, res) => {

    if(req.body){
        try{
            const taskRecord = new task(req.body);
            await taskRecord.save();
            res.status(201).send(taskRecord);
        }catch(e){
            res.status.send("Unable to add a record : " + e );
        };
    }


    //======== code uses promise chaining ======
    // console.log("adding a task record/document");
    // if(req.body){
    //     const taskInstance = new task(req.body);
    //     taskInstance.save()
    //     .then(() => {
    //         res.status(201).send(taskInstance);
    //     })
    //     .catch((err) =>{
    //         console.log(err);
    //         res.status(400).send("Unable to add record: " + err );
    //     })
    // }

});

//---------------------->> route to read all tasks
app.get("/tasks" , async (req, res ) => {
    try{
        const tasks = await task.find({});  
        res.send(tasks); 
    }catch(e){
        res.status(500).send(e);
    };
    
    //======= this code uses promise chaining =====
    // task.find({}).then((tasks) => {
    //     res.send(tasks);
    // })
    // .catch((e) => { res.status(500).send(e)});
});

//----------------------->> route to read on task
app.get("/tasks/:id", async (req, res ) => {
    const _id = req.params.id;

    try{
        const taskRecord = await task.findById(_id);
        if(!taskRecord){
            return res.status(404).send("No task found with a given ID");
        }
        res.send(taskRecord);
    }catch(e){
        res.status(500).send(e);
    };

    //==== this code uses promise chaining =======
    // task.findById(_id).then((oneTask) => {
    //     if(!oneTask){
    //         return res.status(404).send("No task found with a given id");
    //     }
    //     res.send(oneTask);
    // })
    // .catch((e) => {
    //     res.status(500).send(e);
    // })

});

//========== a route to update a task by id
app.patch("/tasks/:id", async (req, res ) => {

    const updates = Object.keys(req.body);
    const allowedOperation = ["done","description"];
    const isValidOperation = updates.every( (update) => allowedOperation.includes(update) );

    if(!isValidOperation){
        return res.status(400).send({error:"Invalid updates!"})
    }

    try{
        const taskUpdate = await task.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true});
        
        if(!taskUpdate){
            return res.status(404).send("Unsuccesful Update");
        }

        return res.send(taskUpdate);
    }catch(e){
        return res.status(500).send();
    }

});




app.listen(port, () =>{
  console.log("Server running on port: ", port);
});
