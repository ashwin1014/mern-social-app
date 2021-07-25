/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
import { Router } from 'express';

// import { isEmpty } from '../utils';
import Post from '../models/Posts';
import User from '../models/User';
import HttpError from '../models/http-error';

const postsRouter = Router();

// @desc create post
postsRouter.post('/', async (req, res, next) => {
  const newPost = new Post(req.body);

  try {
    const savedPost = await newPost.save();
    res.status(200).json({
      success: true,
      status: 200,
      message: 'create_success',
      data: savedPost,
    });
  } catch (err) {
    next(err);
  }
});

// @desc update post
postsRouter.put('/:id', async (req, res, next) => {
  try {
    const post = Post.findById(req.params.id);

    if (post.userId === req.body.userId) {
      const updatedPost = await post.updateOne({
        $set: req.body,
      });
      res.status(200).json({
        success: true,
        status: 200,
        message: 'update_success',
        data: updatedPost,
      });
    } else {
      return next(new HttpError('only_self_edit', 403));
    }
  } catch (err) {
    next(err);
  }
});

// @desc delete post
postsRouter.delete('/:id', async (req, res, next) => {
  try {
    const post = Post.findById(req.params.id);

    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json({
        success: true,
        status: 200,
        message: 'delete_success',
        data: null,
      });
    } else {
      return next(new HttpError('only_self_delete', 403));
    }
  } catch (err) {
    next(err);
  }
});

// @desc like/dislike a post
postsRouter.put('/:id/like', async (req, res, next) => {
  try {
    const post = Post.findById(req.params.id);

    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({
        $push: {
          likes: req.body.userId,
        },
      });
      res.status(200).json({
        success: true,
        status: 200,
        message: 'post_liked',
        data: null,
      });
    } else {
      await post.updateOne({
        $pull: {
          likes: req.body.userId,
        },
      });
      res.status(200).json({
        success: true,
        status: 200,
        message: 'post_disliked',
        data: null,
      });
    }
  } catch (err) {
    next(err);
  }
});

// @desc get posts
postsRouter.get('/:id', async (req, res, next) => {
  try {
    const posts = await Post.findById(req.params.id);
    res.status(200).json({
      success: true,
      status: 200,
      message: '',
      data: posts,
    });
  } catch (err) {
    next(err);
  }
});

// @desc get timeline posts
postsRouter.get('/timeline/all', async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.body.id);
    const currentUserPosts = await Post.find({
      userId: currentUser._id,
    });
    const friendsPosts = await Promise.all(
      // eslint-disable-next-line array-callback-return
      currentUser.following.map((friendId) => {
        Post.find({ userId: friendId });
      }),
    );
    res.status(200).json({
      success: true,
      status: 200,
      message: '',
      data: [...currentUserPosts, ...friendsPosts],
    });
  } catch (err) {
    next(err);
  }
});

export default postsRouter;
