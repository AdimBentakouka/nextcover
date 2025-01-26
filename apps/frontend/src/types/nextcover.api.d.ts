interface Credentials {
    email: string,
    password: string
}

interface SignUpCredentials extends Credentials {
    username: string,
}

interface ResponseApi<T> {
    data?: T,
    error?: string
}

interface User {
    id: string,
    username: string,
    avatar: string,
    email: string,
    isOwner: boolean,
    approvedAt: Date,
    createdAt: string,
    updatedAt: string
}

interface LoginResponse {
    accessToken: string,
    refreshToken: User
}