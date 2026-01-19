import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import task from "./task.js";

const userSchema = new mongoose.Schema({ 
    name: {type: String,
           required:true
    } ,
    age:{   
        type: Number,
        default: 0,
        validate(value){
            if(value < 0 ){
                throw new Error("Negative age number not valid");
            }
        }
    },
    email:{
        type:String,
        index: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address");
            }
        }        
    },
    password:{
        type: String,
        trim: true,
        required: true,
        validate(value){
            value = value.toLowerCase();
            if(value.length <= 6){
                throw new Error("Password is below minimum characters allowed");
            };

            if(value.includes("password")){
                throw new Error("invalid password character pattern detected");
            }
        }
    },
    tokens: [{
            token:{
                type: String,
                required: true
            }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

//==== setting up a relationship between user and a task
userSchema.virtual("usertasks",{
    ref: "tasks",
    localField: "_id",
    foreignField: "owner"
});

//====== defining instance method ==================
userSchema.methods.generateAuthToken = async function(){
    const userDoc = this;

    const token = jwt.sign( { _id: userDoc._id.toString() } ,"thisismynewcourse");

    userDoc.tokens = userDoc.tokens.concat({ token });
    await userDoc.save();
    
    return token;
} ;

// hiding private data for user response
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
};



//=========== defining a new function findByCredentials ===============
userSchema.statics.findByCredentials = async ( email, password ) => {
    
    const userDoc = await user.findOne({email});
    if(!userDoc){
        throw new Error("Unable to login");
    };

    const isMatch = await bcrypt.compare(password, userDoc.password);
    if(!isMatch){
        throw new Error("Unable to login");
    }

    return userDoc;
};

//=========== hashes the plain text password before saving it =========
userSchema.pre("save", async function (next){ 
    const user = this;

    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 8);
    }

    next(); //to ensure this function does not hang
});


//=========== delete user tasks when user is removed =========
userSchema.pre("deleteOne", { document: true, query: false }, async function (next){  
    const user = this;
    await task.deleteMany({ owner: user._id });
    
    next(); //to ensure this function does not hang
});

const user = mongoose.model('users', userSchema);

export default user;