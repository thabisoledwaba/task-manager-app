import mongoose from "mongoose";

//======creating model for tasks 
const task = mongoose.model('tasks', {
    description:{
        type: String,
        required:true,
        trim: true,
        validate(value){
            if(!value){
                throw new Error("Task description has not been supplied");
            }
        }
    },
    done:{type: Boolean,
        default: false
    }
});

export default task;