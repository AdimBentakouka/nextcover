import Image from 'next/image';
import RedirectAuth from './authRedirect';

export const AuthHeader = () => {
    return (
        <div className="flex flex-col gap-2  items-center">
            <div className="flex h-24 w-24 items-center justify-center mb-2">
                <Image
                    src="/images/icons/nextcover.svg"
                    alt="Icône NextCover"
                    width={128}
                    height={128}
                />
            </div>
            <h1 className="text-xl font-bold">Bienvenue sur NextCover</h1>
            <RedirectAuth />
        </div>
    );
};
