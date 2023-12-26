import { Router } from 'express';
import { sampleRouter } from './routers/sample.router';
import { userRouter } from './routers/userRouter';
import { cartRouter } from './routers/cartRouter';

const router = Router();

router.get('/', (req, res) => {
  res.send(`Hello, Purwadhika Student !`);
});

router.use('/sample', sampleRouter);

// add another router here ...
router.use('/users', userRouter);
router.use('/carts', cartRouter);

export default router;
