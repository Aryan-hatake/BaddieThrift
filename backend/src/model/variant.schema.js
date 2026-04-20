import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  product: { type: ObjectId, ref: "products" },
  size: String
});

