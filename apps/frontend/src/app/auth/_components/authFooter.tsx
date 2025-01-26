'use client';

import Link from 'next/link';

const AuthFooter = () => {
    return (
        <>
            <div
                className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary ">
                En utilisant NextCover, vous acceptez nos{' '}
                <Link href="#Todo">Conditions d&#39;utilisation</Link> et la{' '}
                <Link href="#Todo">Politique de confidentialité</Link>.
            </div>
        </>
    );
};

export default AuthFooter;
