import { Router } from 'express';
import {
  getActive,
  increment,
  decrement,
  remove,
  addToCart,
  getAllCart,
} from '../controllers/cartController';
import { verifyToken } from '../middleware/auth';

const cartRouter = Router();

cartRouter.get('/', verifyToken, getAllCart);
cartRouter.post('/add', verifyToken, addToCart);

cartRouter.delete('/:id', async (req, res) => {
  const result = await remove(req, res);
  res.json(result);
});

cartRouter.get('/:id', async (req, res) => {
  try {
    const result = await getActive(req, res);
    res.json(result);
  } catch (error) {
    res.status(400).send(error);
  }
});

cartRouter.patch('/increment/:id', async (req, res) => {
  try {
    const result = await increment(req, res);
    res.send(result);
  } catch (error) {
    res.status(400).send(error);
  }
});

cartRouter.patch('/decrement/:id', async (req, res) => {
  try {
    const result = await decrement(req, res);
    res.send(result);
  } catch (error) {
    res.status(400).send(error);
  }
});

export { cartRouter };