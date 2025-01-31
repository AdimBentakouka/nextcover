export const messages = {
    logs: {
        watchFolder: {
            watched: (paths: string): string => `Folder watched ["${paths}"].`,
            unwatched: (paths: string): string =>
                `Folder unwatched ["${paths}"].`,
            fileAdded: (path: string): string =>
                `File '${path}' has been added.`,
            fileChanged: (path: string): string =>
                `File '${path}' has been changed.`,
            fileRemoved: (path: string): string =>
                `File '${path}' has been removed.`,
        },
        googleBooksApi: {
            fetching: (title: string): string =>
                `Fetching Google Books API for title '${title}'.`,
        },
    },
    errors: {
        path: {
            notExist: (path: string): string =>
                `The directory '${path}' does not exist in the file system.`,
            alreadyUsed: (path: string): string =>
                `A library with the directory '${path}' already exists.`,
        },
        library: {
            notFound: (id: string): string =>
                `The library with ID '${id}' was not found.`,
        },
        file: {
            extensionNotAllowed: (fileName: string): string =>
                `The file '${fileName}' has an unsupported file extension and will be ignored.`,
        },
        metadata: {
            unknownStrategy: (strategy: string): string =>
                `Unknown metadata strategy '${strategy}'.`,
        },
        googleBooksApi: {
            googleBooksFetchError: (): string =>
                'Error fetching Google Books API.',
            tooManyRequests: (
                title: string,
                retry: number,
                delay: number,
            ): string =>
                `Too Many Requests for title "${title}". Retrying (${retry}) in ${delay}ms...`,
            tooManyRequestsFinal: (title: string): string =>
                `Too Many Requests for title "${title}". Giving up.`,
            notFound: (title: string): string =>
                `No results found for title "${title}".`,
        },
        reader: {
            unknownReader: (reader: string): string =>
                `Unknown reader '${reader}'.`,
            coverNotFound: (title: string) => `Cover not found for '${title}'.`,
            invalidRangePages: (maxPage: number) =>
                `The page number must be between 1 and ${maxPage}'.`,
        },
        ebook: {
            notFound: (title: string): string =>
                `Ebook '${title}' was not found.`,
            IdOrFilepathRequired: `Id or filepath is required`,
        },
        user: {
            notFound: (param: string) => `User '${param} not found.`,
        },
        token: {
            tokenExpired: `Token expired`,
            invalidToken: `Invalid token`,
        },
        auth: {
            emailAlreadyUsed: (email: string) =>
                `Email '${email}' already used`,
            unauthorized: `You must be logged.`,
            isOwnerRequired: `You must be the owner.`,
            approvalRequired: (username: string) =>
                `User '${username}' not approved yet.`,
        },
        notImplemented: (functionName: string): string =>
            `Function '${functionName}' is not implemented.`,
    },
    success: {
        library: {
            created: (name: string, path: string): string =>
                `The library '${name}' was successfully created and mapped to the directory '${path}'.`,
            updated: (name: string): string =>
                `The library '${name}' was successfully updated.`,
            deleted: (id: string): string =>
                `The library with ID '${id}' was successfully deleted.`,
        },
        user: {
            created: (email: string): string =>
                `User '${email}' was successfully created.`,
            updated: (email: string): string =>
                `User '${email}' was successfully updated.`,
            deleted: (id: string): string =>
                `User with ID '${id}' was successfully deleted.`,
        },
        ebook: {
            created: (title: string): string =>
                `Ebook '${title}' was successfully created.`,
            deleted: (title: string): string =>
                `Ebook '${title}' was successfully deleted.`,
            updated: (title: string): string =>
                `The ebook '${title}' was successfully updated.`,
            coverCreated: (path: string): string =>
                `Cover '${path}' was successfully created`,
        },
        watchFolder: {
            scanCompleted: (): string =>
                'Initial scan completed. Ready for changes.',
        },
        googleBooksApi: {
            titleMapped: (
                ebookTitle: string,
                googleTitle: string,
                score: number,
            ): string =>
                `Strategy for Google API Books mapped '${ebookTitle}' to '${googleTitle}' with score ${score}`,
        },
    },
};
