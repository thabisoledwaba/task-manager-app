import express from "express";
import user from "../models/user.js";

const userRouter = new express.Router();

//=== route for adding users
userRouter.post("/users", async (req, res) => {

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
userRouter.get("/users", async (req, res ) => {

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
userRouter.get("/users/:id", async ( req, res ) => {
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
userRouter.patch("/users/:id", async (req, res) => {
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

//========== route to delete a user by id =======================
userRouter.delete("/users/:id", async (req, res ) => {

    try{
        const User = await user.findByIdAndDelete(req.params.id);
        if(!User){
            return res.status(404).send({error:"No user with a given id"});
        }
        res.status(200).send("delete successfull");
    }catch(e){
        res.status(500).send();
    };

});



export default userRouter;