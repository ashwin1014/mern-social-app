/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';

const { Schema } = mongoose;

const PostsSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    max: 500,
  },
  img: {
    type: String,
  },
  likes: {
    type: Array,
    default: [],
  },
}, {
  timestamps: true,
});

export default mongoose.model('Posts', PostsSchema);
