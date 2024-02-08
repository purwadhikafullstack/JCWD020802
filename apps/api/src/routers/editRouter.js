import { Router } from 'express';
import { verifyToken } from "../middleware/auth";
import { changePassword, editBirthdate, editEmail, editFullname, editGender, editUsername, resetPassword, sendResetPasswordEmail, updatePhotoProfile, verifyEmail } from '../controllers/editController';
import { multerUpload } from "../middleware/multer";
import { checkRegisterEmail } from '../middleware/validator';

const editRouter = Router()

editRouter.post("/send-reset-password-email", checkRegisterEmail, sendResetPasswordEmail)
editRouter.patch("/reset-password", verifyToken, resetPassword)
editRouter.patch("/fullname", verifyToken, editFullname)
editRouter.patch("/username", verifyToken, editUsername)
editRouter.patch("/birthdate", verifyToken, editBirthdate)
editRouter.patch("/gender", verifyToken, editGender)
editRouter.patch("/email", verifyToken, editEmail)
editRouter.patch("/verify-email", verifyToken, verifyEmail)
editRouter.patch("/change-password", verifyToken, changePassword)
editRouter.patch("/profile-picture", verifyToken, multerUpload().single('file'), updatePhotoProfile)

export { editRouter }