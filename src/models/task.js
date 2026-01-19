import mongoose from "mongoose";


const taskSchema = new mongoose.Schema( {
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
    done:{
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    }
},{
    timestamps: true
});

taskSchema.pre("save", async function(next){
    //not using it though
    const task = this;
    console.log("Just before saving a task document");

    next();
})

//======creating model for tasks 
const task = mongoose.model('tasks', taskSchema);

export default task;