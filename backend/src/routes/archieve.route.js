import { Router } from "express";
import archivedControllers from "../controller/archieve.controller.js";
import { authUser}  from "../middleware/auth.middleware.js";

const router = Router();

router.post("/add",authUser,archivedControllers.addToArchive);
router.delete("/delete/:productId/:variantId",authUser,archivedControllers.removeFromArchive);
router.get("/",authUser,archivedControllers.getAllArchivedProducts);


export default router;