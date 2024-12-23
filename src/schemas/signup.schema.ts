import * as z from "zod";
import {emailGeneric} from "@/schemas/generics/email.generic";
import {newPasswordGeneric} from "@/schemas/generics/newPassword.generic";
import {passwordGeneric} from "@/schemas/generics/password.generic";

export const signupSchema = z
    .object({
        email: emailGeneric,
        password: newPasswordGeneric,
        confirmPassword: passwordGeneric,
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne sont pas identiques.",
        path: ["confirmPassword"],
    });

export type signupSchemaType = z.infer<typeof signupSchema>;
