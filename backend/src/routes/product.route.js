import { authUser } from "../middleware/auth.middleware.js"
import {Router} from 'express';
import multer from 'multer'
import productController from "../controller/product.controller.js";

const upload = multer({storage:multer.memoryStorage()})

const productRouter = Router();

productRouter.post("/createProduct",authUser,upload.array("images",7),productController.createProduct)

export default productRouter