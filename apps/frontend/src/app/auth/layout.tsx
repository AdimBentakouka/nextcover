import {PropsWithChildren} from 'react';
import {AuthHeader} from '@/app/auth/_components/authHeader';
import AuthFooter from '@/app/auth/_components/authFooter';

const AuthLayout = ({children}: PropsWithChildren) => {
    return (
        <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <AuthHeader />
                    {children}
                    <AuthFooter />
                </div>
            </div>
        </main>
    );
};

export default AuthLayout;
