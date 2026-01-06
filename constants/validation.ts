import { z } from 'zod';

export const emailSchema = z
  .string({ required_error: 'Email is required' })
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

export const passwordSchema = z
  .string({ required_error: 'Password is required' })
  .min(1, 'Password is required')
  .min(6, 'Password must be at least 6 characters');

export const strongPasswordSchema = z
  .string({ required_error: 'Password is required' })
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const phoneSchema = z
  .string({ required_error: 'Phone number is required' })
  .min(1, 'Phone number is required')
  .regex(/^[0-9]{9,11}$/, 'Please enter a valid phone number');

export const fullNameSchema = z
  .string({ required_error: 'Full name is required' })
  .min(1, 'Full name is required')
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters');

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z
  .object({
    fullName: fullNameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: strongPasswordSchema,
    confirmPassword: z.string({ required_error: 'Please confirm your password' }).min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
