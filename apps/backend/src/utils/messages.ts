export const messages = {
    logs: {
        WATCH_FOLDER_WATCHED: `Folder watched ["{paths}"].`,
        WATCH_FOLDER_UNWATCHED: `Folder unwatched ["{paths}"].`,
        WATCH_FOLDER_FILE_ADDED: "File '{path}' has been added.",
        WATCH_FOLDER_FILE_CHANGED: "File '{path}' has been change.",
        WATCH_FOLDER_FILE_REMOVED: "File '{path}' has been removed.",
        FETCH_GOOGLE_BOOKS_API: 'Fetching Google Books API for {title}.',
    },
    errors: {
        PATH_NOT_EXIST_FS:
            "The directory '{path}' does not exist in the file system.",
        LIBRARY_NOT_FOUND: "The library with ID '{id}' was not found.",
        LIBRARY_PATH_ALREADY_EXISTS:
            "A library with the directory '{path}' already exists.",
        FILE_EXTENSION_NOT_ALLOWED:
            "The file '{fileName}' has an unsupported file extension and will be ignored.",
        UNKNOWN_METADATA_STRATEGY: "Unknown metadata strategy '{strategy}'.",
        FETCH_GOOGLE_BOOKS_API: 'Error fetching Google Books API.',
        FETCH_GOOGLE_BOOKS_API_TOO_MANY_REQUESTS:
            'Too Many Requests for title "{title}". Retrying ({retry}) in {delay}ms...',
        FETCH_GOOGLE_BOOKS_API_TOO_MANY_REQUESTS_FINAL: `Too Many Requests for title "{title}". Giving up.`,
        FETCH_GOOGLE_BOOKS_API_NOT_FOUND: `No results found for title "{title}".`,
        UNKNOWN_READER: "Unknown reader '{reader}'.",
        NOT_IMPLEMENTED: "Function '{functionName}' is not implemented.",
        COVER_NOT_FOUND: "Cover not found for '{title}'.",
        INVALID_NUMBER_PAGES:
            "The page number must be between 1 and {maxPage}'.",
    },
    success: {
        LIBRARY_CREATED:
            "The library '{name}' was successfully created and mapped to the directory '{path}'.",
        LIBRARY_UPDATED: "The library '{name}' was successfully updated.",
        LIBRARY_DELETED: "The library with ID '{id}' was successfully deleted.",
        GOOGLE_BOOKS_API_TITLE_MAPPED:
            'Strategy for Google API Books mapped {ebookTitle} to {googleTitle} with score {score}',
        WATCH_FOLDER_SCAN_COMPLETED:
            'Initial scan completed. Ready for changes.',
        EBOOK_CREATED: 'Ebook "{title}" was successfully created',
        COVER_CREATED: 'Cover "{path}" was successfully created',
    },
};
