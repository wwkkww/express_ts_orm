import mongoose from 'mongoose';
import { Post } from './post.interface';

const postSchema = new mongoose.Schema({
  // One-to-One: one Post only has one Author
  // author: {
  //   ref: 'User',
  //   type: mongoose.Schema.Types.ObjectId
  // },

  // Many-to-Many (two-way referencing): 
  // One Post can have many authors 
  author: [
    {
      ref: 'User',
      type: mongoose.Schema.Types.ObjectId
    }
  ],
  content: String,
  title: String
})


// const postModel = mongoose.model<IPost>('Post', postSchema)

// mongoose model Type must derived from mongoose.Document
type PostType = Post & mongoose.Document;
const postModel = mongoose.model<PostType>('Post', postSchema)

export default postModel