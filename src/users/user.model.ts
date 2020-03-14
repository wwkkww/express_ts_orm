import mongoose from 'mongoose';
import User from './user.interface';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
})

type UserType = User & mongoose.Document
const userModel = mongoose.model<UserType>('User', userSchema)

export default userModel