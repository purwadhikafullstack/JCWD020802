import { Router } from 'express';
import { verifyToken } from "../middleware/auth";
import { addAddress, getCity, getProvince, getByUserId, getProvinceByCity, getCityByProvince, changeAddressById, deleteAddressById, changeMainAddressById, getAddressById, getUserMainAddress } from '../controllers/addressController';

const addressRouter = Router()

addressRouter.get("/province", getProvince)
addressRouter.get("/city", getCity)
addressRouter.post("/add", verifyToken, addAddress)
addressRouter.get("/main/:UserId", verifyToken, getUserMainAddress)
addressRouter.get("/customer/:UserId", verifyToken, getByUserId)
addressRouter.get("/list/:UserId", verifyToken, getAddressById)
addressRouter.get("/province/:id", getProvinceByCity)
addressRouter.get("/city/:ProvinceId", getCityByProvince)
addressRouter.patch("/change-address/:id", verifyToken, changeAddressById)
addressRouter.patch("/change-main/:id", verifyToken, changeMainAddressById)
addressRouter.delete("/delete/:id", verifyToken, deleteAddressById)

export { addressRouter }