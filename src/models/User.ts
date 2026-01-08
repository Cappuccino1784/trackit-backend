import mongoose, { Document } from "mongoose";
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
}

//hash password before saving (can be done in controller as well)

const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
});

userSchema.pre<IUser>('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model<IUser>("User", userSchema);

export default User;
