import config from "./config.js";
import mongoose from "mongoose";

const connectToDB = async()=>{
    try{
        await mongoose.connect(config.MongoURI)
        console.log("Connected to DB.")
    }
    catch(err){
        console.log("could not connect to DB" , err.message)
    }
}

export default connectToDB


