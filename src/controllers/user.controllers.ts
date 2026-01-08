import { Request, Response } from "express";
import User from '../models/User'

export const getAllUsers = async ( req: Request, res: Response) => {
    const users = await User.find()
    res.send(users)
}

export const getUserById = async ( req: Request, res: Response) => {
    const { id } = req.params
    const user = await User.findById(id)
    if (!user) {
        return res.status(404).send({ message: 'User not found' })
    }
    res.send(user)
}

export const deleteUser = async ( req: Request, res: Response) => {
    const { id } = req.params
    await User.findByIdAndDelete(id)
    res.send({ message: 'User deleted' })
}

export const updateUser = async ( req: Request, res: Response) => {
    const { id } = req.params
    const { username, email } = req.body
    await User.findByIdAndUpdate(id, { username, email })
    res.send({ message: 'User updated' })
}
