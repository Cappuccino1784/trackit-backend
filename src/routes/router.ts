import Router from 'express';
import authRouter from './auth.routes';
import userRouter from './user.routes';
import transRouter from './trans.routes';
import accRouter from './accounts.routes';

const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('/user', userRouter)
appRouter.use('/trans', transRouter);
appRouter.use('/accounts', accRouter);

export default appRouter;