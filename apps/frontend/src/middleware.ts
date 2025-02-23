import {NextRequest, NextResponse} from 'next/server';
import {apiSessionRoute, authRoutes, DEFAULT_APP_REDIRECT, DEFAULT_AUTH_REDIRECT} from '@/routes';
import {hasSession} from '@/lib/session';


const middleware = async (req: NextRequest) => {
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Credentials', 'true');

    const {nextUrl} = req;

    const isApiSessionRoute = nextUrl.pathname.startsWith(apiSessionRoute);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);


    if (isApiSessionRoute) return;


    const isAuth = await hasSession();

    if (isAuth) {
        if (isAuthRoute) {
            return Response.redirect(new URL(DEFAULT_APP_REDIRECT, nextUrl));
        }
    }

    if (!isAuth) {
        if (!isAuthRoute) {
            return Response.redirect(new URL(DEFAULT_AUTH_REDIRECT, nextUrl));
        }
    }

    return;
};


export default middleware;

// Optionally, don't invoke Middleware on some paths
export const config = {

    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};