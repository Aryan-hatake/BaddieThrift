import userModel from "../model/user.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import passport from "passport";

async function register(req, res) {
  try {
    const { fullName, password, email, contactNo , isSeller} = req.body;


    const userExist = await userModel.findOne({
      $or: [{ email }, { contactNo }],
    });

    if (userExist) {
      return res.status(409).json({
        success: false,
        message:
          email === userExist.email
            ? "user already exist with same email"
            : "user already exist with same contact number",
      });
    }

    const user = await userModel.create({
      fullName,
      email,
      contactNo,
      password,
      role: !isSeller ? email.endsWith("@seller.com") ? "seller" : "buyer" : "seller",
    });

    const token = jwt.sign(
      {
        id: user._id,
      },
      config.JWTSecret,
      { expiresIn: "3h" },
    );

    res.cookie("token", token);

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      success: true,
      message: "user has been registered successfully",
      user: userObj,
    });
  } catch (err) {
    console.log(err.message, err.stack);
    res.status(400).json({
      success: false,
      message: "error in registering user",
      err: err.message,
    });
  }
}
async function login(req, res) {
  try {
    let { email, contactNo, password } = req.body;

    [email, contactNo] = [email || "", contactNo || ""];

    const user = await userModel.findOne({
      $or: [{ email }, { contactNo }],
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "invalid credentials" });
    }
     
    const isPassValid = await user.comparePass(password);

    if (!isPassValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id }, config.JWTSecret, {
      expiresIn: "3h",
    });

    res.cookie("token", token);

    res.status(201).json({
      success: true,
      message: "user logged in successfully",
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "user failed in login",
      err: err.message,
    });
  }
}
async function google(req, res) {
  const { id } = req.user;
  const fullName = req.user.displayName;
  const email = req.user.emails[0].value;

  let user = await userModel.findOne({email});

  if(!user){
    user = await userModel.create({
      fullName,
      email,
      googleId:id    
    })
  }

  const token = jwt.sign({
    id:user._id
  },config.JWTSecret)
  
  res.cookie("token",token)

  res.redirect("http://localhost:5173/");
}
async function getMe(req,res) {
  const user = req.user

  res.status(200).json({
    success:true,
    message:"user hydrated successfully",
    user
  })
}
export default { register, login, google, getMe };
