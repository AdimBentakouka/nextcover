import * as z from 'zod';
import {nameGeneric} from '@/schemas/generics/name.generic';
import {emailGeneric} from '@/schemas/generics/email.generic';

export const EditProfilSchema = z.object({
    username: nameGeneric,
    email: emailGeneric,
});