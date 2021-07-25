/* eslint-disable consistent-return */
import { Router } from 'express';

import User from '../models/User';
import HttpError from '../models/http-error';

const router = Router();

// REGISTER
router.post('/register', async (req, res, next) => {
  const {
    username, email, password, mobileNumber,
  } = req.body;

  if (!email || !password || !username) {
    return next(new HttpError('credentials_missing', 400));
  }

  let isExisting;
  try {
    isExisting = await User.findOne({ email });
  } catch (err) {
    res.status(500).json({
      errorCode: 500,
      errMsg: err.message,
    });
  }

  try {
    if (isExisting) {
      return next(new HttpError('email_in_use', 500));
    }

    const newUser = new User({
      username,
      email,
      password,
      mobileNumber,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

// LOGIN
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new HttpError('credentials_missing', 400));
  }

  try {
    const existingUser = await User.findOne({ email }).select('+password');
    // const validatePassword = await bcrypt.compare(password, existingUser.password);

    // if (!existingUser) {
    //   res.status(404).json({ errorCode: 404, errMsg: 'user_not_found' });
    //   return;
    // }
    // if (!validatePassword) {
    //   res.status(500).json({ errorCode: 500, errMsg: 'invalid_password' });
    //   return;
    // }

    if (!existingUser) {
      return next(new HttpError('user_not_found', 401));
    }

    const isPasswordMatched = await existingUser.matchPassword(password);

    if (!isPasswordMatched) {
      return next(new HttpError('invalid_password', 401));
    }

    res.status(200).json(existingUser);
  } catch (err) {
    next(err);
  }
});

export default router;
