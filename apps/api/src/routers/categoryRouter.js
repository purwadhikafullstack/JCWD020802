import { Router } from 'express';
import { checkSuperAdminRole, verifyToken } from "../middleware/auth";
import { addCategory, deleteCategoryById, editCategoryById, getCategory, getAllTrashCategory, restoreCategoryById, trashCategoryById, getAllCategory } from '../controllers/categoryController';

const categoryRouter = Router()

categoryRouter.get("/", getAllCategory)
categoryRouter.get("/list", verifyToken, checkSuperAdminRole, getCategory)
categoryRouter.get("/trash-list", verifyToken, checkSuperAdminRole, getAllTrashCategory)
categoryRouter.post("/add", verifyToken, checkSuperAdminRole, addCategory)
categoryRouter.post("/restore/:id", verifyToken, checkSuperAdminRole, restoreCategoryById)
categoryRouter.patch("/move-to-trash/:id", verifyToken, checkSuperAdminRole, trashCategoryById)
categoryRouter.patch("/edit/:id", verifyToken, checkSuperAdminRole, editCategoryById)
categoryRouter.delete("/delete/:id", verifyToken, checkSuperAdminRole, deleteCategoryById)

export { categoryRouter }