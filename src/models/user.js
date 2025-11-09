import mongoose from "mongoose";
import validator from "validator";

const user = mongoose.model('users',{ 
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
    }
});

export default user;