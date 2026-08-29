import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  phone: z
    .string()
    .regex(/^\+998\d{9}$/, 'Phone must be in format +998XXXXXXXXX')
    .optional(),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z.string().min(1),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(6).max(100),
});

export const googleAuthSchema = z.object({
  idToken: z.string().min(1),
});

export const emailRequestSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});
export const verifyCodeSchema = z.object({
  sessionId: z.string().uuid(),
  code: z.string().min(6).max(6),
});
export const completeRegistrationSchema = z.object({
  sessionId: z.string().uuid(),
  username: z.string().min(3).max(30),
  password: z.string()
    .min(8)
    .regex(/[A-Z]/, 'Katta harf bo''lishi shart')
    .regex(/[a-z]/, 'Kichik harf bo''lishi shart')
    .regex(/[0-9]/, 'Raqam bo''lishi shart')
    .regex(/[^A-Za-z0-9]/, 'Maxsus belgi bo''lishi shart'),
});

