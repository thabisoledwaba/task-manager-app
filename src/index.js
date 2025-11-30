import express from "express";
import  "./db/mongoose.js";
import userRouter from "./routers/user.js";
import taskRouter from "./routers/task.js"

const app = express();
const port = process.env.port || 3000;

// parse requests to js objects
app.use(express.json());

// pass routers to be used
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () =>{
  console.log("Server running on port: ", port);
});
