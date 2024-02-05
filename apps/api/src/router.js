import { Router } from 'express';
import { sampleRouter } from './routers/sample.router';
import { userRouter } from './routers/userRouter';
import { cartRouter } from './routers/cartRouter';
import { editRouter } from './routers/editRouter';
import { addressRouter } from './routers/addressRouter';


const router = Router();

router.get('/', (req, res) => {
  res.send(`Hello, Purwadhika Student !`);
});

router.use('/sample', sampleRouter);

// add another router here ...
router.use('/users', userRouter)
router.use('/edits', editRouter)
router.use('/carts', cartRouter)
router.use('/addresses', addressRouter)

export default router;
