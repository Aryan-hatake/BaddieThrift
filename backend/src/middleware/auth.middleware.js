import jwt from "jsonwebtoken";
import config from "../config/config.js";
import userModel from "../model/user.model.js";

export async function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(404).json({
      success: false,
      message: "token not found",
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, config.JWTSecret);
  } catch (err) {
    console.log(err);
  }

  const { id } = decoded;

  const user = await userModel.findById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "user not found",
    });
  }

  req.userId = user._id;
  req.userName = user.fullName;
  req.isSeller = user.role === "seller" ? true : false;
  req.user = user;
  next();
}
