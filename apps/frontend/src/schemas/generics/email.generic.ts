import * as z from "zod";

export const emailGeneric = z
    .string()
    .email("Vous devez entrer une adresse e-mail valide.");
