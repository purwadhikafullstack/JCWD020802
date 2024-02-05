import { Router } from 'express';
import { checkSuperAdminRole, verifyToken } from "../middleware/auth";
import { addWarehouse, deleteWarehouseById, editWarehouseById, getAllTrashWarehouse, getAllWarehouse, getWarehouse, restoreWarehouseById, trashWarehouseById } from '../controllers/warehouseController';

const warehouseRouter = Router()

warehouseRouter.get("/", verifyToken, getAllWarehouse)
warehouseRouter.get("/list", verifyToken, checkSuperAdminRole, getWarehouse)
warehouseRouter.get("/trash-list", verifyToken, checkSuperAdminRole, getAllTrashWarehouse)
warehouseRouter.post("/add", verifyToken, checkSuperAdminRole, addWarehouse)
warehouseRouter.post("/restore/:id", verifyToken, checkSuperAdminRole, restoreWarehouseById)
warehouseRouter.patch("/move-to-trash/:id", verifyToken, checkSuperAdminRole, trashWarehouseById)
warehouseRouter.patch("/edit/:id", verifyToken, checkSuperAdminRole, editWarehouseById)
warehouseRouter.delete("/delete/:id", verifyToken, checkSuperAdminRole, deleteWarehouseById)

export { warehouseRouter }