import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:[true, "seller is required"]
    },
    title:{
         type:String,
          required:[true, "title is required"]
    },
    description:{
        type:String,
        required:[true, "description is required"]
    },
    price:{
        amount:{
            type:Number,
            required:[true, "amount is required"]
        },
        currency:{
            type:String,
            required:[true, "currency is required"],
            enum:["INR","JPY","GBP","USD"]
        }
    },
    stock:{
        type:Number,
        required:[true, "stock is required"]
    },
    sku:{
        type:String,
        required:[true, "sku is required"]
    },
    status:{
        type:String,
        enum:["active","low_stock","draft"],
        default:"draft"
    },
    images:[String],
    variants:[
        {
            type:String,
            options:Array,
            images:Array
        },
    
    ]
},{timestamps:true})

const productModel = mongoose.model("products",productSchema)

export default productModel