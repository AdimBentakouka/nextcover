'use client';

import {createContext, PropsWithChildren, useCallback, useContext, useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import nextCoverInstance from '@/lib/api/nextcover';
import {deleteSession, getSession} from '@/lib/session';


enum SESSION_STATUSES {
    PENDING = 'PENDING',
    UNAUTHENTICATED = 'UNAUTHENTICATED',
    AUTHENTICATED = 'AUTHENTICATED',
}

type SessionStatus = keyof typeof SESSION_STATUSES;

interface Session {
    status: SessionStatus;
    user: User | null;
}

interface SessionContextType {
    session: Session;
    updateSession: () => void;
    logout: () => void;
}


const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps extends PropsWithChildren {
    user?: ResponseApi<User>;
}

export const SessionContextProvider = ({children, user}: SessionProviderProps) => {
    const router = useRouter();

    const [session, setSession] = useState<Session>({
        status: SESSION_STATUSES.PENDING,
        user: user?.data ? user.data : null,
    });

    const handleUnauthenticatedSession = useCallback(async () => {
        const session = await getSession();

        if (session) {
            void await nextCoverInstance.revokeSession(session.refreshToken);
            void deleteSession();
        }


        setSession({
            status: SESSION_STATUSES.UNAUTHENTICATED,
            user: null,
        });

        router.push('/auth/login');
    }, [router]);

    const updateSession = useCallback(async () => {
        try {
            const response = await nextCoverInstance.getSession();

            if (response.data) {
                setSession({
                    status: SESSION_STATUSES.AUTHENTICATED,
                    user: response.data,
                });
            } else {
                handleUnauthenticatedSession();
            }


        } catch {
            handleUnauthenticatedSession();
        }
    }, [handleUnauthenticatedSession]);

    useEffect(() => {
        void updateSession();
    }, [updateSession]);

    return (
        <SessionContext.Provider value={{session, updateSession, logout: handleUnauthenticatedSession}}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = (): SessionContextType => {
    const context = useContext(SessionContext);

    if (!context) {
        throw new Error('useSession must be used within a SessionContextProvider');
    }

    return context;
};