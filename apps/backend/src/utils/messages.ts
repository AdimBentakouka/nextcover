export const messages = {
    logs: {
        WATCH_FOLDER_WATCHED: `Folder watched ["{paths}"].`,
        WATCH_FOLDER_UNWATCHED: `Folder unwatched ["{paths}"].`,
        WATCH_FOLDER_SCAN_COMPLETED:
            'Initial scan completed. Ready for changes.',
        WATCH_FOLDER_FILE_ADDED: "File '{path}' has been added.",
        WATCH_FOLDER_FILE_CHANGED: "File '{path}' has been change.",
        WATCH_FOLDER_FILE_REMOVED: "File '{path}' has been removed.",
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
    },
    success: {
        LIBRARY_CREATED:
            "The library '{name}' was successfully created and mapped to the directory '{path}'.",
        LIBRARY_UPDATED: "The library '{name}' was successfully updated.",
        LIBRARY_DELETED: "The library with ID '{id}' was successfully deleted.",
    },
};
