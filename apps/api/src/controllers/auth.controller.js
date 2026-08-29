import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../lib/prisma.js';
import { signToken } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { publicUser, provisionCartAndWishlist } from '../utils/shared.js';

const googleClient = process.env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  : null;

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const normalizedEmail = (email || '').trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) throw new AppError('Email already registered', 409, 'EMAIL_TAKEN');

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash,
      phone: phone ? phone.trim() : undefined,
      role: 'CUSTOMER',
    },
  });
  await provisionCartAndWishlist(user.id);

  const token = signToken({ id: user.id, sub: user.id, role: user.role });
  res.status(201).json({ token, user: publicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  const normalizedId = (identifier || '').trim().toLowerCase();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: normalizedId },
        { username: normalizedId },
        { phone: identifier ? identifier.trim() : undefined },
      ].filter(Boolean),
    },
  });
  if (!user || !user.passwordHash) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }
  if (user.status === 'BANNED') throw new AppError('Account banned', 403, 'BANNED');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');

  const token = signToken({ id: user.id, sub: user.id, role: user.role });
  res.json({ token, user: publicUser(user) });
});

export const googleAuth = asyncHandler(async (req, res) => {
  if (!googleClient) {
    throw new AppError('Google login is not configured on this server', 503, 'NOT_CONFIGURED');
  }
  const { idToken } = req.body;

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload?.email) throw new AppError('Invalid Google token', 401, 'INVALID_TOKEN');

  const googleEmail = payload.email.trim().toLowerCase();

  let user = await prisma.user.findFirst({
    where: { OR: [{ googleId: payload.sub }, { email: googleEmail }] },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: payload.name || googleEmail.split('@')[0],
        email: googleEmail,
        googleId: payload.sub,
        avatarUrl: payload.picture,
        role: 'CUSTOMER',
      },
    });
    await provisionCartAndWishlist(user.id);
  } else {
    // Unified account linking: merge googleId & avatar if missing
    const updates = {};
    if (!user.googleId) updates.googleId = payload.sub;
    if (!user.avatarUrl && payload.picture) updates.avatarUrl = payload.picture;
    if (Object.keys(updates).length > 0) {
      user = await prisma.user.update({ where: { id: user.id }, data: updates });
    }
  }

  if (user.status === 'BANNED') throw new AppError('Account banned', 403, 'BANNED');

  const token = signToken({ id: user.id, sub: user.id, role: user.role });
  res.json({ token, user: publicUser(user) });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email: (email || '').trim().toLowerCase() } });

  if (!user) return res.json({ message: 'If that email exists, a reset link has been sent.' });

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry },
  });

  console.log(`[password-reset] token for ${email}: ${resetToken}`);
  res.json({ message: 'If that email exists, a reset link has been sent.' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const user = await prisma.user.findFirst({
    where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
  });
  if (!user) throw new AppError('Invalid or expired reset token', 400, 'INVALID_RESET_TOKEN');

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetToken: null, resetTokenExpiry: null },
  });

  res.json({ message: 'Password reset successful' });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

import { generateOtp, hashOtp, verifyOtp } from '../services/otp.service.js';
import { sendEmailOTP } from '../services/email.service.js';

export const requestEmailVerification = asyncHandler(async (req, res) => {
  const { email, name } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) throw new AppError("Ushbu email ro'yxatdan o'tgan", 409, 'EMAIL_TAKEN');

  // Cancel any old pending sessions for this email
  await prisma.verificationSession.updateMany({
    where: { email: normalizedEmail, status: 'PENDING', type: 'EMAIL' },
    data: { status: 'EXPIRED' }
  });

  const session = await prisma.verificationSession.create({
    data: {
      email: normalizedEmail,
      type: 'EMAIL',
      expiresAt: new Date(Date.now() + 10 * 60_000), // 10 mins
    },
  });

  const otp = generateOtp();
  const otpHash = await hashOtp(otp);

  await prisma.otpVerification.create({
    data: {
      sessionId: session.id,
      telegramId: 'email', 
      otpHash,
      expiresAt: new Date(Date.now() + 10 * 60_000),
    },
  });

  await sendEmailOTP(normalizedEmail, otp);

  res.json({ sessionId: session.id, message: 'Email manzilingizga tasdiqlash kodi yuborildi' });
});

export const verifyEmailOtp = asyncHandler(async (req, res) => {
  const { sessionId, code } = req.body;
  const session = await prisma.verificationSession.findUnique({ where: { id: sessionId } });

  if (!session || session.type !== 'EMAIL') throw new AppError('Session topilmadi', 404, 'SESSION_NOT_FOUND');
  if (session.status !== 'PENDING') throw new AppError('Session yaroqsiz', 400, 'INVALID_SESSION');
  if (new Date() > session.expiresAt) throw new AppError('Session muddati tugagan', 400, 'EXPIRED');

  const otpRecord = await prisma.otpVerification.findUnique({ where: { sessionId } });
  if (!otpRecord) throw new AppError('OTP topilmadi', 404, 'OTP_NOT_FOUND');
  if (otpRecord.attempts >= 5) throw new AppError('Urinishlar soni tugadi', 400, 'MAX_ATTEMPTS');

  const isValid = await verifyOtp(code, otpRecord.otpHash);
  if (!isValid) {
    await prisma.otpVerification.update({ where: { sessionId }, data: { attempts: { increment: 1 } } });
    throw new AppError("Kod noto'g'ri", 400, 'INVALID_CODE');
  }

  await prisma.otpVerification.update({ where: { sessionId }, data: { verified: true } });
  await prisma.verificationSession.update({ where: { id: sessionId }, data: { status: 'VERIFIED' } });

  res.json({ message: 'Kod tasdiqlandi. Endi login va parol yarating.' });
});

export const completeRegistration = asyncHandler(async (req, res) => {
  const { sessionId, username, password, name } = req.body;
  const session = await prisma.verificationSession.findUnique({ where: { id: sessionId } });

  if (!session || session.status !== 'VERIFIED') {
    throw new AppError("Oldin tasdiqlash jarayonidan o'ting", 400, 'NOT_VERIFIED');
  }

  const normalizedUsername = username.trim().toLowerCase();
  const existingUsername = await prisma.user.findFirst({ where: { username: normalizedUsername } });
  
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        session.phone ? { phone: session.phone } : null,
        session.email ? { email: session.email } : null,
      ].filter(Boolean)
    }
  });

  if (existingUsername && (!user || existingUsername.id !== user.id)) {
    throw new AppError('Bu login (username) band', 409, 'USERNAME_TAKEN');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  
  if (user) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        username: normalizedUsername,
        passwordHash,
        phone: session.phone || user.phone,
        email: session.email || user.email,
        name: name || user.name
      }
    });
  } else {
    user = await prisma.user.create({
      data: {
        name: name || 'Foydalanuvchi',
        username: normalizedUsername,
        email: session.email,
        phone: session.phone,
        passwordHash,
        role: 'CUSTOMER',
      },
    });
    await provisionCartAndWishlist(user.id);
  }

  await prisma.verificationSession.update({ where: { id: sessionId }, data: { status: 'COMPLETED' } });

  const token = signToken({ id: user.id, sub: user.id, role: user.role });
  res.status(201).json({ token, user: publicUser(user) });
});

