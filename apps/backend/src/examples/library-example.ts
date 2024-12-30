export const libraryExample = {
    create: {
        name: 'My Library',
        path: '/home/user/library',
        libraryType: 'book',
        metadataStrategy: 'Google Books API',
        id: '12565e18-14f2-412c-86db-09a367d84134',
        createdAt: '2024-12-27T16:37:00.000Z',
        updatedAt: '2024-12-27T16:37:00.000Z',
    },
    update: {
        id: '062c3c9e-388f-4fe1-8f56-689ed4432203',
        name: 'My Library',
        path: '/home/user/library',
        libraryType: 'book',
        metadataStrategy: 'Google Books API',
        createdAt: '2024-12-29T22:19:11.000Z',
        updatedAt: '2024-12-29T23:05:34.000Z',
        ebooks: [],
    },
    findAll: [
        {
            id: '12565e18-14f2-412c-86db-09a367d84134',
            name: 'My Library',
            path: '/home/user/library',
            libraryType: 'book',
            metadataStrategy: 'Google Books API',
            createdAt: '2024-12-27T16:37:00.000Z',
            updatedAt: '2024-12-27T16:37:00.000Z',
        },
    ],
    findOne: {
        id: '062c3c9e-388f-4fe1-8f56-689ed4432203',
        name: 'My Library',
        path: '/home/user/library',
        libraryType: 'book',
        metadataStrategy: 'Google Books API',
        createdAt: '2024-12-29T22:19:11.000Z',
        updatedAt: '2024-12-29T23:05:34.000Z',
        ebooks: [],
    },
    delete: {
        message:
            "The library with ID '5a3eca0a-a26c-4cf3-857b-ad5063348973' was successfully deleted.",
    },
    notFound: {
        message:
            "The library with id 'b74a71a6-9dc8-4fd2-9fb0-aeb96aab15b2' not found.",
        error: 'Not Found',
        statusCode: 404,
    },
    validationError: {
        message: [
            {
                property: 'name',
                children: [],
                constraints: {
                    isDefined: 'name should not be null or undefined',
                    isString: 'name must be a string',
                    isLength:
                        'name must be longer than or equal to 3 characters',
                },
            },
            {
                property: 'path',
                children: [],
                constraints: {
                    isDefined: 'path should not be null or undefined',
                    isString: 'path must be a string',
                    isLength:
                        'path must be longer than or equal to 1 characters',
                },
            },
            {
                property: 'libraryType',
                children: [],
                constraints: {
                    isDefined: 'libraryType should not be null or undefined',
                    isEnum: 'libraryType must be one of the following values: book, manga, manwa, bd, other',
                },
            },
            {
                property: 'metadataStrategy',
                children: [],
                constraints: {
                    isDefined:
                        'metadataStrategy should not be null or undefined',
                    isEnum: 'metadataStrategy must be one of the following values: Google Books API',
                },
            },
        ],
        error: 'Bad Request',
        statusCode: 400,
    },
    conflictPath: {
        message:
            "The directory '/home/user/library' does not exist in the file system.",
        error: 'Conflict',
        statusCode: 409,
    },
    pathExist: {
        message:
            "A library with the directory '/home/user/library/' already exists.",
        error: 'Conflict',
        statusCode: 409,
    },
};
