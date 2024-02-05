import { Router } from 'express';
import { sampleRouter } from './routers/sample.router';
import { userRouter } from './routers/userRouter';
import { cartRouter } from './routers/cartRouter';
import { editRouter } from './routers/editRouter';
import { addressRouter } from './routers/addressRouter';
import { warehouseRouter } from './routers/warehouseRouter';
import { adminRouter } from './routers/adminRouter';
import { productRouter } from './routers/productRouter';
import { categoryRouter } from './routers/categoryRouter';
import { stockRouter } from './routers/stockRouter';


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
router.use('/warehouses', warehouseRouter)
router.use('/admins', adminRouter)
router.use('/products', productRouter)
router.use('/categories', categoryRouter)
router.use('/stocks', stockRouter)

export default router;
