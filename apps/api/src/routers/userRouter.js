import { Router } from 'express';
import { 
    getAll, 
    loginUser,
    keepLogin,
    registerUser,
    sendRegisterEmail,
    checkEmail,
    registerGoogleUser,
    getById,
    resendVerificationEmail
} from "../controllers/userController";
import { checkSuperAdminRole, verifyToken } from "../middleware/auth";
import { checkLogin, checkRegisterUser, checkRegisterEmail } from "../middleware/validator";


const userRouter = Router();

userRouter.get("/", verifyToken, checkSuperAdminRole, getAll);
userRouter.get("/login", checkLogin, loginUser)
userRouter.get("/keep-login", verifyToken, keepLogin)
userRouter.post("/register", registerUser)
userRouter.get("/check-email", checkEmail)
userRouter.get("/:id", verifyToken, getById)
userRouter.post("/resend-email-verification", checkRegisterEmail, resendVerificationEmail)
userRouter.post("/register-email", checkRegisterEmail, sendRegisterEmail)
userRouter.post("/register-google-user", registerGoogleUser)
userRouter.patch("/register-user", verifyToken, checkRegisterUser, registerUser)
userRouter.get("/:id", verifyToken, getById)


export { userRouter };