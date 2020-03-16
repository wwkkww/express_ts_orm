import mongoose from 'mongoose';
import User from './user.interface';

const addressSchema = new mongoose.Schema({
  city: String,
  street: String,
  country: String,
})

const userSchema = new mongoose.Schema({
  address: addressSchema,
  name: String,
  email: String,
  password: String,

  // Many-to-Many (two-way referencing): 
  // A user can be author of many Posts 
  // posts: [
  //   {
  //     ref: 'Post',
  //     type: mongoose.Schema.Types.ObjectId,
  //   }
  // ]
})

type UserType = User & mongoose.Document
const userModel = mongoose.model<UserType>('User', userSchema)

export default userModel