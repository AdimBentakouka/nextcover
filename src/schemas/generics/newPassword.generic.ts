import * as z from "zod";

const regexPwd =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const newPasswordGeneric = z
    .string()
    .min(1, "Vous devez entrer un mot de passe.")
    .regex(regexPwd, "Mot de passe trop faible");
