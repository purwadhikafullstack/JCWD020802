import { Router } from 'express';
import { sampleRouter } from './routers/sample.router';
import { userRouter } from "./routers/userRouter";
import { editRouter } from './routers/editRouter';

const router = Router();

router.get('/', (req, res) => {
  res.send(`Hello, Purwadhika Student !`);
});

router.use('/sample', sampleRouter);

// add another router here ...
router.use('/users', userRouter)
router.use('/edits', editRouter)

export default router;
