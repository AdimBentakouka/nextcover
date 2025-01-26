'use server';

import {signUpSchema, SignupSchemaType} from '@/schemas/signUpSchema';
import {signUp} from '@/lib/api/nextcover';

export const signUpAction = async (data: SignupSchemaType) => {

    const validatedForm = await signUpSchema.safeParseAsync(data);

    if (!validatedForm.success) {
        return {error: validatedForm.error};
    }

    return signUp(validatedForm.data);
};