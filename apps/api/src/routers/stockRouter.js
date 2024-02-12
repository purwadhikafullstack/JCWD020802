import { Router } from 'express';
import { checkSuperAdminRole, verifyToken } from "../middleware/auth";
import { addNewStock, deleteStockById, editStockById, getAllTrashStock, getStock, getStockByProductId, restoreStockById, trashStockById } from '../controllers/stockController';

const stockRouter = Router()

stockRouter.get("/", verifyToken, checkSuperAdminRole, getStock)
stockRouter.get("/:ProductId", getStockByProductId)
stockRouter.get("/trash-list", verifyToken, checkSuperAdminRole, getAllTrashStock)
stockRouter.post("/add", verifyToken, checkSuperAdminRole, addNewStock)
stockRouter.post("/restore/:id", verifyToken, checkSuperAdminRole, restoreStockById)
stockRouter.patch("/move-to-trash/:id", verifyToken, checkSuperAdminRole, trashStockById)
stockRouter.patch("/edit/:id", verifyToken, checkSuperAdminRole, editStockById)
stockRouter.delete("/delete/:id", verifyToken, checkSuperAdminRole, deleteStockById)

export { stockRouter }