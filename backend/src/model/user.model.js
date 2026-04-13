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
    required: function(){
      console.log(this)
      return !this.googleId
    },
    select: false,
  },
  contactNo: {
    type: Number,
  },
  role: {
    type: String,
    default:"buyer",
    enum: ["buyer", "seller"],
  },
  googleId:{
    type:String
  }
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePass = async function (password) {
  console.log(password)
  const user = await userModel.findById(this._id).select("+password")
  if(user.googleId) return true;
   return   await bcrypt.compare(password, user.password);
};

const userModel = mongoose.model("users", userSchema);

export default userModel;
