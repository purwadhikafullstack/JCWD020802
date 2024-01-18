import { Router } from 'express';
import { verifyToken } from "../middleware/auth";
import { editBirthdate, editEmail, editFullname, editGender, editUsername, updatePhotoProfile } from '../controllers/editController';
import { multerUpload } from "../middleware/multer";

const editRouter = Router()

editRouter.patch("/fullname", verifyToken, editFullname)
editRouter.patch("/username", verifyToken, editUsername)
editRouter.patch("/birthdate", verifyToken, editBirthdate)
editRouter.patch("/gender", verifyToken, editGender)
editRouter.patch("/email", verifyToken, editEmail)
editRouter.patch("/profile-picture", verifyToken, multerUpload().single('file'), updatePhotoProfile)

export { editRouter }