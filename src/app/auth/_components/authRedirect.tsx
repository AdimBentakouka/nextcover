"use client";

import {usePathname} from "next/navigation";
import Link from "next/link";

const RedirectHeader = () => {
    const pathname = usePathname();

    if (pathname === "/auth/login") {
        return (
            <p className="text-sm text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary ">
                Vous ne possédez pas de compte ?{" "}
                <Link
                    href="/auth/signup"
                    className="underline underline-offset-4"
                >
                    S&apos;inscrire
                </Link>
            </p>
        );
    }

    return (
        <p className="text-sm text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary ">
            Vous possédez déjà un compte ?{" "}
            <Link href="/auth/login" className="underline underline-offset-4">
                Se connecter
            </Link>
        </p>
    );
};

export default RedirectHeader;
