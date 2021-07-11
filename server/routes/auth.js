import { Router } from 'express';
import bcrypt from 'bcrypt';

import User from '../models/User';
// import HttpError from '../models/http-error';

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
    res.status(500).json(err);
  }

  try {
    if (isExisting) {
      res.status(500).json({ errorCode: 500, errMsg: 'email_in_use' });
      return;
    }

    // generate hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      mobileNumber,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    // const error = new HttpError('Error registering user', 500);
    res.status(500).json(err);
    // next(error);
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    const validatePassword = await bcrypt.compare(password, existingUser.password);

    if (!existingUser) {
      res.status(404).json({ errorCode: 404, errMsg: 'user_not_found' });
      return;
    }
    if (!validatePassword) {
      res.status(500).json({ errorCode: 500, errMsg: 'invalid_password' });
      return;
    }

    res.status(200).json(existingUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
