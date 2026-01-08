import Router from 'express'
import { getAllUsers, deleteUser, getUserById, updateUser } from '../controllers/user.controllers'
const userRouter = Router()

// Get All Users
userRouter.get('/get-users', getAllUsers)

// Get User by ID
userRouter.get('/get-user/:id', getUserById)

// Delete User by ID
userRouter.delete('/delete-user/:id', deleteUser)

// Update User by ID
userRouter.put('/update-user/:id', updateUser)

export default userRouter
