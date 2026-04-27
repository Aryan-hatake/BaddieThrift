import mongoose, { Mongoose } from 'mongoose'

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"users",
    required: true,
  },
  paymentId:{
    type:String
  },
  cart:{
       type:mongoose.Schema.Types.ObjectId,
    ref:"carts",
    required: true,
  },
  signature: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum:["pending","success","failed"],
    default: 'pending',
  },
}, { timestamps: true });

const Payment = mongoose.model('Payments', paymentSchema);

export default Payment