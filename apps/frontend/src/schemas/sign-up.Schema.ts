import * as z from 'zod';
import {emailGeneric} from '@/schemas/generics/email.generic';
import {newPasswordGeneric} from '@/schemas/generics/newPassword.generic';
import {passwordGeneric} from '@/schemas/generics/password.generic';
import {nameGeneric} from '@/schemas/generics/name.generic';

export const signUpSchema = z
    .object({
        username: nameGeneric,
        email: emailGeneric,
        password: newPasswordGeneric,
        confirmPassword: passwordGeneric,
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Les mots de passe ne sont pas identiques.',
        path: ['confirmPassword'],
    });

export type SignupSchemaType = z.infer<typeof signUpSchema>;
