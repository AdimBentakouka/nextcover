export const AuthExample = {
    conflictEmail: {
        message: "Email 'my@e-mail.com' already used",
        error: 'Conflict',
        statusCode: 409,
    },
    signUp: {
        username: 'John Doe',
        email: 'my@e-mail.com',
        avatar: null,
        id: '8d9a5475-f008-47f6-9a4d-e3efa0c83cbc',
        approvedAt: null,
        createdAt: '2025-01-26T11:37:56.000Z',
        updatedAt: '2025-01-26T11:37:56.000Z',
    },
    login: {
        accessToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiZDZlNjAwYS03YTBjLTQxMzQtOGM0Ni0zNjJkMWMyZmI5NjAiLCJpc093bmVyIjp0cnVlLCJpYXQiOjE3MzgzNDY2NDcsImV4cCI6MTc0MDkzODY0N30.qNbJhvP2U3A07mLOj_CuqY4Z4pOYv2piMquEa6b8ddI',
        refreshToken: '16b474d5-6b66-4adc-b761-3ddf90b529d8',
    },

    loginFailed: {
        wrongCredentials: {
            message: 'Unauthorized',
            statusCode: 401,
        },
        approvalRequired: {
            message: "User 'John Doe' not approved yet.",
            error: 'Unauthorized',
            statusCode: 401,
        },
    },
};
