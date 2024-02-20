import { Router } from 'express';
import { checkSuperAdminRole, verifyToken } from "../middleware/auth";
import { multerUpload } from "../middleware/multer";
import { addCategory, deleteCategoryById, editCategoryById, getCategory, getAllTrashCategory, restoreCategoryById, trashCategoryById, getAllCategory } from '../controllers/categoryController';

const categoryRouter = Router()

categoryRouter.get("/", getAllCategory)
categoryRouter.get("/list", verifyToken, checkSuperAdminRole, getCategory)
categoryRouter.get("/home", getCategory)
categoryRouter.get("/trash-list", verifyToken, checkSuperAdminRole, getAllTrashCategory)
categoryRouter.post("/add", verifyToken, checkSuperAdminRole, multerUpload().single('file'), addCategory)
categoryRouter.post("/restore/:id", verifyToken, checkSuperAdminRole, restoreCategoryById)
categoryRouter.patch("/move-to-trash/:id", verifyToken, checkSuperAdminRole, trashCategoryById)
categoryRouter.patch("/edit/:id", verifyToken, checkSuperAdminRole, multerUpload().single('file'), editCategoryById)
categoryRouter.delete("/delete/:id", verifyToken, checkSuperAdminRole, deleteCategoryById)

export { categoryRouter }