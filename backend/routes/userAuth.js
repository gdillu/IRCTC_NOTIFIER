import express from 'express';
import { check } from 'express-validator';
import { register, verify,login } from '../controllers/authUser.js';

const router = express.Router();

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('phone', 'Phone number is required').isMobilePhone(),
  ],
  register
);

router.post(
  '/verify',
  [
    check('phone', 'Phone number is required').isMobilePhone(),
    check('code', 'Verification code is required').not().isEmpty(),
  ],
  verify
);

router.post(
  '/login',
  [
    check('phone','Phone number is not Valid').isMobilePhone()
  ],
  login
);

export default router;
