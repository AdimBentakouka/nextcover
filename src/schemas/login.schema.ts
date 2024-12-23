import * as z from "zod";
import {emailGeneric} from "@/schemas/generics/email.generic";
import {passwordGeneric} from "@/schemas/generics/password.generic";

export const loginSchema = z.object({
    email: emailGeneric,
    password: passwordGeneric,
});

export type loginSchemaType = z.infer<typeof loginSchema>;
