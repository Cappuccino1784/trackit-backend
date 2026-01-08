import Router from 'express';
import authRouter from './auth.routes';
import userRouter from './user.routes'
import transRouter from './trans.routes';

const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('/user', userRouter)
appRouter.use('/trans', transRouter);

export default appRouter;