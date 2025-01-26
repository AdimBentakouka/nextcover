import * as z from "zod";

export const nameGeneric = z
    .string()
    .min(1, "Vous devez saisir un nom de compte");
