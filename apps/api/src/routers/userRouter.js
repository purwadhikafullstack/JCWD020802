import { Router } from 'express';
import { 
    getAll, 
    loginUser,
    keepLogin,
    registerUser
} from "../controllers/userController";
import { verifyToken } from "../middleware/auth";
import { checkLogin } from "../middleware/validator";

const userRouter = Router();

userRouter.get("/", getAll);
userRouter.get("/login", checkLogin, loginUser)
userRouter.get("/keep-login", verifyToken, keepLogin)
userRouter.post("/register", registerUser)

export { userRouter };