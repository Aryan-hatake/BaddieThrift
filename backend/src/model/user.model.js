import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "fullname is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    select: false,
  },
  contactNo: {
    type: Number,
    required: [true, "contact number is required"],
  },
  role: {
    type: String,
    required: [true, "role is required"],
    enum: ["buyer", "seller"],
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePass = async function (password) {
  const user = await userModel.findById(this._id).select("+password")
  return await bcrypt.compare(password, user.password);
};

const userModel = mongoose.model("user", userSchema);

export default userModel;
