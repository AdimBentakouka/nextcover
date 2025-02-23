import {createSession, getSession} from '@/lib/session';
import {messages} from '@/lib/messages';

export class NextCoverApi {

    private isRefreshing = false;
    private requestQueue: RequestQueue[] = [];

    constructor(private readonly baseURL: string) {
    }

    public login = async (credentials: Credentials): Promise<ResponseApi<LoginResponse>> => {
        return await this.fetch<LoginResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    };

    public signUp = async (credentials: SignUpCredentials): Promise<ResponseApi<User>> => {
        return await this.fetch<User>('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    };

    public getSession = async () => {
        return await this.fetch<User>('/users/me');

    };

    public revokeSession = async (refreshToken: string) => {
        return await this.fetch<{message: string}>('/auth/revoke-token', {
            method: 'POST',
            body: JSON.stringify({refreshToken}),
        });
    };

    private fetch = async <T>(path: string, options?: RequestInit): Promise<ResponseApi<T>> => {

        return new Promise<ResponseApi<T>>(async (resolve, reject) => {
            const session = await getSession();

            const sanitizedBaseURL = this.baseURL.endsWith('/') ? this.baseURL : `${this.baseURL}/`;
            const sanitizedPath = path.startsWith('/') ? path.slice(1) : path;

            const url = sanitizedBaseURL + sanitizedPath;

            if (this.isRefreshing && path !== '/auth/refresh-token') {
                return this.addToQueue({
                    resolve,
                    reject,
                    config: {
                        path,
                        options,
                    },
                });
            }

            console.log('fetching: ', url);
            try {

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.accessToken}`,
                    },
                    ...options,
                });

                const data = await response.json();

                if (!response.ok && data.message === 'Token expired') {

                    this.addToQueue({
                        resolve,
                        reject,
                        config: {
                            path,
                            options,
                        },
                    });

                    if (!this.isRefreshing) {
                        console.log('process refresh token');
                        this.isRefreshing = true;

                        try {
                            await this.refreshToken(session);
                            void this.processQueue(true);
                        } catch {
                            void this.processQueue(false);
                        } finally {
                            this.isRefreshing = false;
                        }

                    }
                    return;

                }

                if (response.ok) {
                    resolve({
                        status: response.status,
                        data,
                    });
                } else {
                    reject({
                        status: response.status,
                        error: data.message,
                    });
                }


            } catch (e) {
                console.error('fetch error: ', e);
                reject({
                    status: 500,
                    error: messages.errors.defaultError,
                });
            }
        });


    };

    /**
     * Ajouter une requête dans la queue pour l'exécuter une fois le token rafraîchi
     */
    private addToQueue(queueItem: RequestQueue) {
        this.requestQueue.push(queueItem);
    }


    private async processQueue(success: boolean) {

        for (const request of this.requestQueue) {
            if (success) {
                request.resolve(await this.fetch(request.config.path, request.config.options));
            } else
                request.reject({
                        status: 401,
                        error: 'Echec to renew token',
                    },
                );
        }

        this.requestQueue = [];
    }

    private refreshToken = async (session: LoginResponse) => {

        const response = await this.fetch<LoginResponse>('/auth/refresh-token', {
            method: 'POST',
            body: JSON.stringify(session),
        });

        if (!response.data) {
            throw new Error(response.error);
        }

        await createSession(response.data);

    };

}