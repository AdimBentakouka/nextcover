import {join} from 'path';
import {messages} from '@/lib/messages';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';


export const login = async (credentials: Credentials): Promise<ResponseApi<LoginResponse>> => {
    return await apiFetch<LoginResponse>(join(API_URL, '/auth/login'), {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const signUp = async (credentials: SignUpCredentials): Promise<ResponseApi<User>> => {
    return await apiFetch<User>(join(API_URL, '/auth/signup'), {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};


/**
 * Makes an HTTP request to the given URL using the Fetch API and returns the parsed JSON response.
 *
 * @template T
 * @param {string} url - The URL to which the request is sent.
 * @param {RequestInit} options - Configuration options for the request, including headers, method, body, etc.
 * @returns {Promise<T>} A promise that resolves to the parsed JSON response of type T.
 * @throws {Error} Throws an error if the HTTP response status is not OK, with a message derived from the response data or status code.
 */
const apiFetch = async <T>(url: string, options: RequestInit): Promise<ResponseApi<T>> => {

    const response = await fetch(url, options);

    try {
        const data = await response.json();

        if (!response.ok) {
            return {
                error: data.message,
            };
        }

        return {
            data,
        };
    } catch (e) {
        console.error(e);
        return {
            error: messages.errors.defaultError,
        };
    }
};

