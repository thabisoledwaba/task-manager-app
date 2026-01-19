import express from "express";
import task from "../models/task.js";
import auth from "../middleware/auth.js";

const taskRouter = new express.Router();

//=== route for adding tasks
taskRouter.post("/tasks",auth, async (req, res) => {

    if(req.body){
        try{
            const taskRecord = new task({
                ...req.body,
                owner: req.user._id
            });

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
// GET /tasks?completed=true
// GET /tasks?limit=4&skip=0
// GET /tasks?sortBy=createdAt_desc 
taskRouter.get("/tasks" , auth, async (req, res ) => {
    try{
        const match = {};
        const sort = {};

        if(req.query.completed){
            match.done = req.query.completed === "true";
        }

        if(req.query.sortBy){
            const parts = req.query.sortBy.split("_")
            sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
        }
        
        const userRec = req.user;
        await userRec.populate({
            path: "usertasks",
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        });
        res.send(userRec.usertasks); 
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
taskRouter.get("/tasks/:id",auth, async (req, res ) => {
    const _id = req.params.id;

    try{
        const taskRecord = await task.findOne( {  _id,  owner: req.user._id} );
        if(!taskRecord){
            return res.status(404).send("No task found");
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
taskRouter.patch("/tasks/:id", auth, async (req, res ) => {

    const updates = Object.keys(req.body);
    const allowedOperation = ["done","description"];
    const isValidOperation = updates.every( (update) => allowedOperation.includes(update) );

    if(!isValidOperation){
        return res.status(400).send({error:"Invalid updates!"})
    }

    try{
        //the line bypasses mongoose middleware
        //const taskUpdate = await task.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true});
        //-const TaskDoc = await task.findById(req.params.id);

        const TaskDoc = await task.findOne( { _id: req.params.id, owner: req.user._id });
        if(!TaskDoc){
            return res.status(401).send("No task found with a given ID")
        }
        updates.forEach((update) => {            
            TaskDoc[update] = req.body[update];
        });

        const taskUpdate = await TaskDoc.save(); 
        
        res.send(taskUpdate);
    }catch(e){
        return res.status(500).send();
    };
});


// ================ route to delete a task ==========================
taskRouter.delete("/tasks/:id", auth, async (req, res ) => {

    try{
        //const Task = await task.findByIdAndDelete(req.params.id);
        const Task = await task.findOne({ _id:req.params.id, owner : req.user._id });
        if(!Task){
            return res.status(404).send({error:"No task with a given id"});
        }
        await task.deleteOne(Task);
        
        res.send("Delete successfull");
    }catch(e){
        res.status(500).send();
    };
});



export default taskRouter;