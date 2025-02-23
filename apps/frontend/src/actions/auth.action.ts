'use server';

import {signUpSchema, type SignupSchemaType} from '@/schemas/signUpSchema';
import {loginSchema, type LoginSchemaType} from '@/schemas/login.schema';
import {createSession} from '@/lib/session';
import nextCoverInstance from '@/lib/api/nextcover';

const BAD_REQUEST = 400;

/**
 * Asynchronous function to handle user sign-up action.
 *
 * @param {SignupSchemaType} data - The input data to be validated and processed for sign-up.
 * @returns {Promise<{status: number, error?: any} | any>} A promise resolving to an error object with status code if validation fails, or the result of the sign-up operation if successful.
 */
export const signUpAction = async (data: SignupSchemaType): Promise<ResponseApi<User>> => {

    const validatedForm = await signUpSchema.safeParseAsync(data);

    if (!validatedForm.success) {
        return {status: BAD_REQUEST, error: validatedForm.error.message};
    }

    return nextCoverInstance.signUp(validatedForm.data);
};

/**
 * Handles the login action for the application.
 *
 * @param {LoginSchemaType} data - The login data to be validated and processed.
 * @returns {Promise<Object>} An object containing the login response or validation error.
 */
export const loginAction = async (data: LoginSchemaType): Promise<ResponseApi<LoginResponse>> => {
    const validatedForm = await loginSchema.safeParseAsync(data);

    if (!validatedForm.success) {
        return {status: BAD_REQUEST, error: validatedForm.error.message};
    }

    const response = await nextCoverInstance.login(validatedForm.data);

    if (response.data) {
        await createSession(response.data);
    }

    return response;
};
