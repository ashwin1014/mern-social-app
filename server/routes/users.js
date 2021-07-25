/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
import { Router } from 'express';
import bcrypt from 'bcrypt';

import User from '../models/User';
import HttpError from '../models/http-error';

const usersRouter = Router();

// @desc  Update User
usersRouter.put('/:id', async (req, res, next) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(12);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        next(err);
      }
    }

    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json({
        success: true,
        status: 200,
        message: 'updated_successfully',
        data: user,
      });
    } catch (err) {
      next(err);
    }
  } else {
    return next(new HttpError('edit_unauthorized', 403));
  }
});

// @desc  delete User
usersRouter.delete('/:id', async (req, res, next) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({
        success: true,
        status: 200,
        message: 'deleted_successfully',
        data: null,
      });
    } catch (err) {
      next(err);
    }
  } else {
    return next(new HttpError('delete_unauthorized', 403));
  }
});

// @desc  get user
usersRouter.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    const {
      createdAt, updatedAt, __v, isAdmin, ...rest
    } = user._doc;

    res.status(200).json({
      success: true,
      status: 200,
      message: '',
      data: rest,
    });
  } catch (err) {
    next(err);
  }
});

// @desc follow a user
usersRouter.put('/:id/follow', async (req, res, next) => {
  // TODO: only allow 1 way follow
  if (req.body.userId !== req.params.id) {
    try {
      const userToFollow = User.findById(req.params.id);
      const currentUser = User.findById(req.body.userId);

      if (!userToFollow.followers.includes(req.body.userId)) {
        await userToFollow.updateOne({
          $push: { followers: req.body.userId },
        });
        await currentUser.updateOne({
          $push: { following: req.body.userId },
        });
        res.status(200).json({
          success: true,
          status: 200,
          message: 'user_follow_success',
          data: null,
        });
      } else {
        return next(new HttpError('already_following', 403));
      }
    } catch (err) {
      next(err);
    }
  } else {
    return next(new HttpError('no_self_follow', 403));
  }
});

// @desc un follow user
usersRouter.put('/:id/unfollow', async (req, res, next) => {
  // TODO: only allow 1 way un follow
  if (req.body.userId !== req.params.id) {
    try {
      const userToFollow = User.findById(req.params.id);
      const currentUser = User.findById(req.body.userId);

      if (userToFollow.followers.includes(req.body.userId)) {
        await userToFollow.updateOne({
          $pull: { followers: req.body.userId },
        });
        await currentUser.updateOne({
          $pull: { following: req.body.userId },
        });
        res.status(200).json({
          success: true,
          status: 200,
          message: 'user_un_follow_success',
          data: null,
        });
      } else {
        return next(new HttpError('already_un_following', 403));
      }
    } catch (err) {
      next(err);
    }
  } else {
    return next(new HttpError('no_self_un_follow', 403));
  }
});

export default usersRouter;
