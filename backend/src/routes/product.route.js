import { authUser } from "../middleware/auth.middleware.js";
import { Router } from "express";
import multer from "multer";
import productController from "../controller/product.controller.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const productRouter = Router();

productRouter.post(
  "/createProduct",
  authUser,
  upload.array("images[]", 7),
  productController.createProduct,
);
productRouter.get(
  "/getSellerProducts",
  authUser,
  productController.getAllSellerProducts,
);

export default productRouter;
