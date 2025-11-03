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


async function readDB(documenFilter, databaseName, collectionName){
    
    await client.connect();
    
    const db = client.db(databaseName);
    const collection = db.collection(collectionName);
    //console.log("docfilter = ",documenFilter);
    try{
        if(documenFilter) {
            const documentArr = await collection.find(documenFilter).toArray();

            documentArr.forEach( (doc) => {
                console.log(doc);
           });
        }else{
            console.log("No documents filter specified");
        }
    }catch(error){
        if(error instanceof MongoServerError){
            console.log("Mongo Server Error :",error);
        }
        throw error;
    }    

    return "done";
};


async function updateDB(query,updateData,databaseName, collectionName){
    
    await client.connect();
    
    const db = client.db(databaseName);
    const collection = db.collection(collectionName);
   
    try{
        if( query && updateData ) {
            const result = await collection.updateMany(query,updateData);           
            console.log(result);
           
        }else{
            console.log("No query/updateData values specified");
        }
    }catch(error){
        if(error instanceof MongoServerError){
            console.log("Mongo Server Error :",error);
        }
        throw error;
    }    

    return "done";
};


async function deleteDB(docFilter, databaseName, collectionName){
    
    await client.connect();
    
    const db = client.db(databaseName);
    const collection = db.collection(collectionName);

    //const insertResult = await collection.insertOne(  );
    try{
        if( docFilter ) {
            const Result = await collection.deleteMany(docFilter);
            console.log("Documents deleted : ", Result.deletedCount );
        }else{
            console.log("No documents specified to delete");
        }
    }catch(error){
        if(error instanceof MongoServerError){
            console.log("Mongo Server Error :",error);
        }
        throw error;
    }    

    return "done";
};


//=============== deleted records =========================
const deleteFilter = {Age:98};
deleteDB(deleteFilter,"task-manager", "users" )
.then(console.log)
.catch(console.error)
.finally(()=>{client.close()});


//===============update records====================
//========= this will set all tasks to  done ======
// const query  = {done:false};
// const update = {$set: { done: true } };

// updateDB( query, update, "task-manager", "tasks" )
// .then(console.log)
// .catch(console.error)
// .finally(()=> client.close());



//===== read tasks document from mongodb ==========
//const docFilter = {_id: new ObjectId("69027dad3a20e3cf4de1ecfa")};
//const docFilter = {done: true};

// readDB(docFilter,"task-manager","tasks")
// .then(console.log)
// .catch(console.error)
// .finally(()=> client.close());

//==== read user documents from mongodb =============
//const docFilter = { Age :40 };
// const docFilter = {_id: new ObjectId("690279d87f09b91485fc3ec8")};

// readDB(docFilter,"task-manager","users")
// .then(console.log)
// .catch(console.error)
// .finally(()=> client.close());

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