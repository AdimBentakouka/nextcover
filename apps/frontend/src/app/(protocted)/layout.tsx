import {PropsWithChildren} from 'react';
import {SessionContextProvider} from '@/hooks/session.hook';

const LayoutProtected = async ({children}: PropsWithChildren) => {

    return (
        <main>
            <SessionContextProvider>
                {children}
            </SessionContextProvider>
        </main>
    );
};

export default LayoutProtected;