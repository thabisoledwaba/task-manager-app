import express from "express";
import user from "../models/user.js";
import auth from "../middleware/auth.js";
import multer from "multer";

const userRouter = new express.Router();

//=== route for adding users
userRouter.post("/users", async (req, res) => {

   if(req.body){
    const User = new user(req.body);
    
    try{
        await User.save();

        const token = await User.generateAuthToken();
        
        res.status(201).send( { User, token } );
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

//==== route to login a user =====
userRouter.post("/users/login", async (req, res) => {
    try{
        const User = await user.findByCredentials(req.body.email, req.body.password);

        const token = await User.generateAuthToken();

        res.send( {User, token} );
    }catch(e){
        res.status(400).send();
    };
});

//==== a route to logout a user =======
userRouter.post("/users/logout", auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            console.log("Checking what token looks like ", token);
            return token.token !== req.token;            
        });
        
        await req.user.save();

        res.send();

    }catch(e){
        res.status(500).send();
    };
});

//===== deletes all tokens linked to a user =====
userRouter.post("/users/logoutall", auth, async (req, res) =>{
    try{
        req.user.tokens = [];

        await req.user.save();

        res.send();
    }catch(e){
        res.status(500).send();
    };
});

//route to get users, the route not supported anymore
userRouter.get("/users",auth, async (req, res ) => {

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

//route to get own profile
userRouter.get("/users/me",auth , async (req, res ) => {

     res.status(200).send(req.user);
});




//==== route to fetch a user single user
userRouter.get("/users/:id",auth , async ( req, res ) => {
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


//======= route to update a own user
userRouter.patch("/users/me", auth, async (req, res) => {
    //const _id = req.params.id;
    const userData = req.body;

    const updates = Object.keys(userData);
    const allowedOperation = ["name","age","email","password"];
    const isValidOperation = updates.every( (update) => allowedOperation.includes(update) );

    if(!isValidOperation){
        return res.status(400).send({error:"Invalid updates!"});
    }

    try{
        //this bypasses mongoose middleware therefore will written defferently
        //const User = await user.findByIdAndUpdate(_id, userData, { new: true, runValidators: true } );

        /* this check is no longer required because we already have a user through auth object
        const User = await user.findById(_id);
        if(!User){
            return res.status(404).send("No user found with a given ID");
        }*/
        
        const User = req.user;
        
        updates.forEach( (update) => {
            User[update] = userData[update];
        });

        const savedUser = await User.save();
        /*if(!savedUser){
            return res.status(400).send( e );
        };  */    
        
        res.send(savedUser);
    }catch(e){
        res.status(500).send(e);
    };
});

//========== route to delete own user  =======================
userRouter.delete("/users/me", auth, async (req, res ) => {
    try{
        const userRec = await  req.user.deleteOne({ _id: req.user._id }) ;
        
        res.status(200).send(userRec);
    }catch(e){
        console.log(e);
        res.status(500).send();
    }
});


//====== route to upload files ==========
const upload = multer({
    //dest: "avatars", //commented out to stop the file from being saved in avatars folder
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if( !file.originalname.match( /\.(jpg|jpeg|png)$/ ) ){ //regular expression
            return cb(new Error("Only jpg,jpeg and png images are allowed"), false);
        }

        cb(undefined,true);
    }
});

userRouter.post("/users/me/avatar", auth, upload.single("avatar"), async (req,res) => {

    req.user.avatar = req.file.buffer;
    await req.user.save();

    res.send();
},
( error, req, res, next ) => {
    res.status(400).send({ Error: error.message });
});

//route to delete a user avatar
userRouter.delete("/users/me/avatar",auth , async (req, res) =>{
    req.user.avatar = undefined;
    await req.user.save();

    res.send({mes:"avatar removed"});
});

//route to fetch avatar to render on a web page
userRouter.get("/users/:id/avatar", async ( req, res ) => {
    
    try{
        const userDoc = await user.findById(req.params.id);
        
        if(!userDoc || !userDoc.avatar){
            throw new Error();
        }

        res.set("Content-Type", "image/jpg");
        res.send(userDoc.avatar);

    } catch(e){
        res.status(404).send( {Error:e.message});
    }
});


export default userRouter;