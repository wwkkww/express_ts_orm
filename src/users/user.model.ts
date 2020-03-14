import mongoose from 'mongoose';
import User from './user.interface';

const addressSchema = new mongoose.Schema({
  city: String,
  street: String,
})

const userSchema = new mongoose.Schema({
  address: addressSchema,
  name: String,
  email: String,
  password: String,
})

type UserType = User & mongoose.Document
const userModel = mongoose.model<UserType>('User', userSchema)

export default userModel