import { Router } from 'express';
import { checkSuperAdminRole, verifyToken } from "../middleware/auth";
import { multerUploadProduct } from "../middleware/multerProduct";
import { addProduct, deleteProductById, editProductById, getProduct, getAllTrashProduct, restoreProductById, trashProductById, getAllProduct } from '../controllers/productController';

const productRouter = Router()

productRouter.get("/", verifyToken, checkSuperAdminRole, getAllProduct)
productRouter.get("/list", verifyToken, checkSuperAdminRole, getProduct)
productRouter.get("/all-user", getProduct)
productRouter.get("/trash-list", verifyToken, checkSuperAdminRole, getAllTrashProduct)
productRouter.post("/add", verifyToken, checkSuperAdminRole, multerUploadProduct().single('file'), addProduct)
productRouter.post("/restore/:id", verifyToken, checkSuperAdminRole, restoreProductById)
productRouter.patch("/move-to-trash/:id", verifyToken, checkSuperAdminRole, trashProductById)
productRouter.patch("/edit/:id", verifyToken, checkSuperAdminRole, multerUploadProduct().single('file'), editProductById)
productRouter.delete("/delete/:id", verifyToken, checkSuperAdminRole, deleteProductById)

export { productRouter }