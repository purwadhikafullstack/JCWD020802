import { Router } from 'express';
import { getDeliveryCost } from '../controllers/rajaongkirController';

const rajaongkirRouter = Router()

rajaongkirRouter.post("/cost", getDeliveryCost)

export { rajaongkirRouter }