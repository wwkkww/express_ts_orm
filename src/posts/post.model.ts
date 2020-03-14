import mongoose from 'mongoose';
import { Post } from './post.interface';

const postSchema = new mongoose.Schema({
  author: { type: String, required: true },
  content: String,
  title: { type: String, required: true }
})


// const postModel = mongoose.model<IPost>('Post', postSchema)

// mongoose model Type must derived from mongoose.Document
type PostType = Post & mongoose.Document;
const postModel = mongoose.model<PostType>('Post', postSchema)

export default postModel