import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { validateBody } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  googleAuthSchema,
  emailRequestSchema,
  verifyCodeSchema,
  completeRegistrationSchema
} from '../utils/validators.js';
import {
  register,
  login,
  googleAuth,
  forgotPassword,
  resetPassword,
  me,
  requestEmailVerification,
  verifyEmailOtp,
  completeRegistration
} from '../controllers/auth.controller.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
});

router.post('/register', authLimiter, validateBody(registerSchema), register);
router.post('/email/send-code', authLimiter, validateBody(emailRequestSchema), requestEmailVerification);
router.post('/email/verify-code', authLimiter, validateBody(verifyCodeSchema), verifyEmailOtp);
router.post('/complete-registration', authLimiter, validateBody(completeRegistrationSchema), completeRegistration);

router.post('/login', authLimiter, validateBody(loginSchema), login);
router.post('/google', authLimiter, validateBody(googleAuthSchema), googleAuth);
router.post('/forgot-password', authLimiter, validateBody(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validateBody(resetPasswordSchema), resetPassword);
router.get('/me', authenticate, me);

export default router;
