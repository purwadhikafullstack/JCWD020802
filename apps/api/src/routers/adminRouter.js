import { Router } from 'express';
import { checkSuperAdminRole, verifyToken } from "../middleware/auth";
import { checkRegisterUser, checkRegisterEmail } from "../middleware/validator";
import { editUserById, sendRegisterWHAdminEmail } from '../controllers/adminController';

const adminRouter = Router();

adminRouter.post("/register-email", verifyToken, checkSuperAdminRole, checkRegisterEmail, sendRegisterWHAdminEmail)
adminRouter.patch("/edit-user/:id", verifyToken, checkSuperAdminRole, editUserById )

export { adminRouter };