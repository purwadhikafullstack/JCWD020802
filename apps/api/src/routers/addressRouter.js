import { Router } from 'express';
import { verifyToken } from "../middleware/auth";
import { addAddress, getCity, getProvince, getByUserId, getProvinceByCity, getCityByProvince } from '../controllers/addressController';

const addressRouter = Router()

addressRouter.get("/province", getProvince)
addressRouter.get("/city", getCity)
addressRouter.get("/customer/:UserId", verifyToken, getByUserId)
addressRouter.get("/province/:id", getProvinceByCity)
addressRouter.get("/city/:ProvinceId", getCityByProvince)
addressRouter.post("/add", verifyToken, addAddress)

export { addressRouter }