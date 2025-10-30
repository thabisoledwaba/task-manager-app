//CRUD operation

import {MongoClient, MongoServerError, ObjectId} from "mongodb";

const connectionUrl = "mongodb://127.0.0.1:27017";
const client = new MongoClient(connectionUrl);

//const databaseName = "task-manager";
const id = new ObjectId();
console.log(id);
console.log(id.getTimestamp());

async function writeDB(userDocuments, databaseName, collectionName){
    
    await client.connect();
    
    const db = client.db(databaseName);
    const collection = db.collection(collectionName);

    //const insertResult = await collection.insertOne(  );
    try{
        if(userDocuments.length != 0) {
            const insertResult = await collection.insertMany(userDocuments);
            console.log("Insert Result: ", insertResult );
        }else{
            console.log("No documents to insert");
        }
    }catch(error){
        if(error instanceof MongoServerError){
            console.log("Mongo Server Error :",error);
        }
        throw error;
    }    

    return "done";
};


// ====== adding user documents/records to users collection/table =======
// writeDB([{name:"Freddy",Age:100},{name:"Stanford",Age:98}], "task-manager", "users" )
// .then(console.log)
// .catch(console.error)
// .finally( () => client.close() );


// ======= adding task documents/records to tasks collection/table =======
// const toDoList = [
//     {description:"go to gym", done:true},
//     {description:"buy grocery after gym", done:false},
//     {description:"do laundry", done:true}
// ];

// writeDB(toDoList, "task-manager", "tasks" )
// .then(console.log)
// .catch(console.error)
// .finally( () => client.close() );