import express from "express";
import task from "../models/task.js";

const taskRouter = new express.Router();

//=== route for adding tasks
taskRouter.post("/tasks", async (req, res) => {

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
taskRouter.get("/tasks" , async (req, res ) => {
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

//----------------------->> route to read on task ---------------------
taskRouter.get("/tasks/:id", async (req, res ) => {
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

//========== a route to update a task by id ====================
taskRouter.patch("/tasks/:id", async (req, res ) => {

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
    };
});


// ================ route to delete a task ==========================
taskRouter.delete("/tasks/:id", async (req, res ) => {

    try{
        const Task = await task.findByIdAndDelete(req.params.id);
        if(!Task){
            return res.status(404).send({error:"No task with a given id"});
        }

        res.send("Delete successfull");
    }catch(e){
        res.status(500).send();
    };
});



export default taskRouter;