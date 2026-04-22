import { authUser } from "../middleware/auth.middleware.js";
import { Router } from "express";
import multer from "multer";
import productController from "../controller/product.controller.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const productRouter = Router();


productRouter.get(
  "/getSellerProducts",
  authUser,
 
  productController.getAllSellerProducts,
);

productRouter.post("/createProduct",authUser,upload.any(),productController.createProducts)
productRouter.get("/getAllProducts", productController.getAllProducts);
productRouter.get("/details/:productId",productController.productDetails)
productRouter.put("/update/:productId",authUser,upload.any(),productController.updateOneProduct)
productRouter.delete("/delete/:productId",authUser,productController.deleteOneProduct)
export default productRouter;
