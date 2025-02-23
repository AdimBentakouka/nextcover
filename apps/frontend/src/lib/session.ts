'use server';
import {cookies} from 'next/headers';
import {type ResponseCookie} from 'next/dist/compiled/@edge-runtime/cookies';

const COOKIE_NAME = 'session';
const COOKIE_OPTIONS: Partial<ResponseCookie> = {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
    sameSite: 'strict',
};

const initializeEmptySession = (): LoginResponse => ({
    accessToken: '',
    refreshToken: '',
});

const getSessionCookie = async () => {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAME);
};

export const createSession = async (session: LoginResponse): Promise<void> => {
    const cookieStore = await cookies();
    cookieStore.set({
        name: COOKIE_NAME,
        value: JSON.stringify(session),
        ...COOKIE_OPTIONS,
    });
};

export const deleteSession = async (): Promise<void> => {
    try {
        const cookieStore = await cookies();
        cookieStore.delete(COOKIE_NAME);
    } catch (error) {
        console.error('Error deleting session:', error);
    }
};

export const hasSession = async (): Promise<boolean> => {
    const cookie = await getSessionCookie();
    return !!cookie;
};

export const getSession = async (): Promise<LoginResponse> => {
    try {
        const cookie = await getSessionCookie();
        if (!cookie) return initializeEmptySession();

        const session = JSON.parse(cookie.value) as LoginResponse;
        if (!session.accessToken && !session.refreshToken) {
            await deleteSession();
            return initializeEmptySession();
        }

        return session;
    } catch (error) {
        console.error('Error parsing session cookie:', error);
        return initializeEmptySession();
    }
};