import { Router } from 'express';
import { verifyToken } from "../middleware/auth";
import { changePassword, editBirthdate, editEmail, editFullname, editGender, editUsername, updatePhotoProfile, verifyNewEmail } from '../controllers/editController';
import { multerUpload } from "../middleware/multer";

const editRouter = Router()

editRouter.patch("/fullname", verifyToken, editFullname)
editRouter.patch("/username", verifyToken, editUsername)
editRouter.patch("/birthdate", verifyToken, editBirthdate)
editRouter.patch("/gender", verifyToken, editGender)
editRouter.patch("/email", verifyToken, editEmail)
editRouter.patch("/verify-new-email", verifyToken, verifyNewEmail)
editRouter.patch("/change-password", verifyToken, changePassword)
editRouter.patch("/profile-picture", verifyToken, multerUpload().single('file'), updatePhotoProfile)

export { editRouter }