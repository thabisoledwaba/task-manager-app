import express from "express";
import  "./db/mongoose.js";
import userRouter from "./routers/user.js";
import taskRouter from "./routers/task.js";

const app = express();
const port = process.env.port || 3000;

// app.use( (req, res, next ) =>{
//     res.status(503).send("Site under maintanence");
// });

// parse requests to js objects
app.use(express.json());

// pass routers to be used
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () =>{
  console.log("Server running on port: ", port);
});


//========== demo code below to test/playground ========

//import task from "./models/task.js";
//import user from "./models/user.js";

//const main = async () => {
  // const taskRec = await task.findById("695946925953a25d75aefe63");
  // await taskRec.populate("owner");
  // console.log(taskRec.owner);

  // const userRec = await user.findById("695946715953a25d75aefe5b");
  // await userRec.populate("usertasks");
  // console.log(userRec.usertasks);
//}

//main()
