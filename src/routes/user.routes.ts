import Router from 'express'
import { getAllUsers, deleteUser, getUserById, updateUser, getCurrentUser } from '../controllers/user.controllers'
import { authMiddleware } from '../middlewares/auth.middleware'

const userRouter = Router()

// Get Current User (authenticated)
userRouter.get('/me', authMiddleware, getCurrentUser)

// Get All Users
userRouter.get('/get-users', getAllUsers)

// Get User by ID
userRouter.get('/get-user/:id', getUserById)

// Delete User by ID
userRouter.delete('/delete-user/:id', deleteUser)

// Update User by ID
userRouter.put('/update-user/:id', updateUser)

export default userRouter
