import { Router } from 'express';
import { checkSuperAdminRole, verifyToken } from "../middleware/auth";
import { checkRegisterEmail } from "../middleware/validator";
import { assignWHAdminByAdminId, editUserById, editWHAdminByAdminId, getWHAdmin, sendRegisterWHAdminEmail, trashUserById } from '../controllers/adminController';

const adminRouter = Router();

adminRouter.get("/warehouse-admin", verifyToken, checkSuperAdminRole, getWHAdmin)
adminRouter.post("/register-email", verifyToken, checkSuperAdminRole, checkRegisterEmail, sendRegisterWHAdminEmail)
adminRouter.post("/assign-warehouse/:UserId", verifyToken, checkSuperAdminRole, assignWHAdminByAdminId)
adminRouter.patch("/edit-user/:id", verifyToken, checkSuperAdminRole, editUserById )
adminRouter.patch("/edit-warehouse-admin/:UserId", verifyToken, checkSuperAdminRole, editWHAdminByAdminId )
adminRouter.patch("/move-to-trash/:id", verifyToken, checkSuperAdminRole, trashUserById )

export { adminRouter };