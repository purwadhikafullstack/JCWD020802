import { Router } from 'express';
import { checkSuperAdminRole, verifyToken } from "../middleware/auth";
import { multerUploadCategory } from "../middleware/multerCategory";
import { addCategory, deleteCategoryById, editCategoryById, getCategory, getAllTrashCategory, restoreCategoryById, trashCategoryById, getAllCategory } from '../controllers/categoryController';

const categoryRouter = Router()

categoryRouter.get("/", getAllCategory)
categoryRouter.get("/list", verifyToken, checkSuperAdminRole, getCategory)
categoryRouter.get("/trash-list", verifyToken, checkSuperAdminRole, getAllTrashCategory)
categoryRouter.post("/add", verifyToken, checkSuperAdminRole, multerUploadCategory().single('file'), addCategory)
categoryRouter.post("/restore/:id", verifyToken, checkSuperAdminRole, restoreCategoryById)
categoryRouter.patch("/move-to-trash/:id", verifyToken, checkSuperAdminRole, trashCategoryById)
categoryRouter.patch("/edit/:id", verifyToken, checkSuperAdminRole, multerUploadCategory().single('file'), editCategoryById)
categoryRouter.delete("/delete/:id", verifyToken, checkSuperAdminRole, deleteCategoryById)

export { categoryRouter }