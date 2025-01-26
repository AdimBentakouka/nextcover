import * as z from 'zod';

const regexPwd = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*(),.?":{}|<>\[\]]).{8,}$/;

export const newPasswordGeneric = z
    .string()
    .min(1, 'Vous devez entrer un mot de passe.')
    .regex(regexPwd, 'Mot de passe trop faible');
