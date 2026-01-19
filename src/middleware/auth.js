import jwt from "jsonwebtoken";
import user from "../models/user.js";

const auth= async (req, res, next ) => {
    
    if(req.method === "GET" && req.path === "/users"){
        res.status(503).send("Operation not supported anymore");
    }

    try{
        const token = req.header("Authorization").replace("Bearer","").trim();
        const decoded = jwt.verify(token,"thisismynewcourse");
        
        const userDoc = await user.findOne( { _id: decoded._id , 
                                              "tokens.token" : token
                                            } );
        
        if(!userDoc){
            throw new Error();
        } 
        req.token = token; //saving a token against the request
        req.user = userDoc;  //to be used by the route handler

        next();
    } catch(e){
        res.status(401).send({error: "Please authenticate"});
    }
       
};

export default auth;