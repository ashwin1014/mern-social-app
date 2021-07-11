import { Router } from 'express';

import User from '../models/User';

const router = Router();

// REGISTER
router.post('/register', async (req, res) => {
  const {
    username, email, password, mobileNumber,
  } = req.body;

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
      res.status(500).json({ errorCode: 500, errMsg: 'email_in_use' });
      return;
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
    res.status(500).json({
      errorCode: 500,
      errMsg: err.message,
    });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ errorCode: 400, errMsg: 'email_password_required' });
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
      res.status(404).json({ errorCode: 404, errMsg: 'user_not_found' });
    }

    const isPasswordMatched = await existingUser.matchPassword(password);

    if (!isPasswordMatched) {
      res.status(500).json({ errorCode: 404, errMsg: 'invalid_password' });
    }

    res.status(200).json(existingUser);
  } catch (err) {
    res.status(500).json({
      errorCode: 500,
      errMsg: err.message,
    });
  }
});

export default router;
