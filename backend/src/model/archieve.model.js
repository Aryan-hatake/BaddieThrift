import mongoose from "mongoose";
const archivedProductSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"products",
        required:true
    },
    variant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"variants",
        required:true
    }
},{timestamps:true});
const ArchivedProductModel = mongoose.model("archieves",archivedProductSchema);
export default ArchivedProductModel;