import * as z from "zod";

export const passwordGeneric = z
    .string()
    .min(1, "Vous devez entrer un mot de passe.");
