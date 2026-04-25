import {Router} from "express";
import cartControllers from "../controller/cart.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const cartRouter = Router();


cartRouter.get("/",authUser,cartControllers.getCart)
cartRouter.post("/addToCart",authUser,cartControllers.addToCart)
cartRouter.delete("/removeFromCart",authUser,cartControllers.removeFromCart)
cartRouter.put("/updateCartItem",authUser,cartControllers.updateCartItem)


export default cartRouter;