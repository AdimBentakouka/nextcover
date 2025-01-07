import {existsSync, mkdirSync, readFileSync} from 'fs';
import {basename, dirname, extname} from 'path';
import {rmSync, writeFileSync} from 'node:fs';

/**
 * Checks if the specified file or directory path exists.
 *
 * @param {string} path - The file or directory path to check.
 * @returns {boolean} Returns true if the path exists, otherwise false.
 */
export const checkPathExists = (path: string): boolean => existsSync(path);

/**
 * Ensures that a given file path ends with a slash ('/').
 *
 * @param {string} path - The input file path to check.
 * @returns {string} - The modified file path that ends with a slash.
 */
export const ensurePathEndWithSlash = (path: string): string =>
    path.endsWith('/') ? path : `${path}/`;

/**
 * Retrieves file information from the provided file path.
 *
 * @param {string} filePath - The path of the file to extract information from.
 * @returns {Object} An object containing details about the file:
 * - `fileName`: The base name of the file without the extension or path.
 * - `filepath`: The full file path as provided.
 * - `directoryName`: The directory name containing the file.
 * - `extension`: The file extension, including the leading dot.
 */
export const getFileInfo = (filePath: string): FileInfo => {
    const fileName = basename(filePath);
    const extension = extname(filePath);

    return {
        fileName: fileName.replace(extension, ''),
        extension: extension,
        filepath: filePath,
        directoryName: basename(directoryPath(filePath)),
    };
};

/**
 * Extracts the extension from the given file path.
 *
 * This function takes a file path as input and returns the file extension,
 * including the leading dot. If the file path does not contain an extension,
 * an empty string is returned.
 *
 * @param {string} filePath - The file path from which to extract the extension.
 * @returns {string} The file extension, including the leading dot, or an empty string if none exists.
 */
export const getExtension = (filePath: string): string => extname(filePath);

/**
 * Reads the content of a specified file asynchronously and returns it as an ArrayBuffer.
 *
 * @param {string} filePath - The path to the file that needs to be read.
 */
export const openFile = (filePath: string): Buffer<ArrayBufferLike> => {
    return readFileSync(filePath);
};

/**
 * Removes a file at the specified file path.
 *
 * @param {string} filePath - The absolute or relative path of the file to be removed.
 * @returns {void}
 */
export const removeFile = (filePath: string): void => {
    return rmSync(filePath);
};

/**
 * The `createFile` variable is a reference to a function or method that facilitates
 * the creation of a new file in the specified context.
 *
 * Its specific behavior and implementation depend on the context in which it is used,
 * such as creating a text file, binary file, or a file in a virtual file system.
 *
 * Ensure to check the associated documentation or coding context for
 * parameter requirements, input/output handling, and supported file formats.
 */
export const createFile = (filePath: string, content: ArrayBuffer): void => {
    mkdirSync(dirname(filePath), {recursive: true});

    writeFileSync(filePath, Buffer.from(content));
};

/**
 * Creates a new directory at the specified path. If parent directories do not exist,
 * they will be created as well.
 *
 * @param {string} path - The file system path where the new directory should be created.
 *                         Can be a relative or absolute path.
 * @returns {string}
 */
export const createDirectory = (path: string): string =>
    mkdirSync(path, {recursive: true});

/**
 * Extracts the base name from a given directory path.
 *
 * @param {string} path - The directory path from which the base name needs to be obtained.
 * @returns {string} The base name of the provided directory path.
 */
export const directoryPath = (path: string): string => dirname(path);

/**
 * Deletes a directory and all of its contents.
 *
 * This function removes the specified directory recursively, including all files
 * and subdirectories within it. If the directory does not exist, the operation is
 * forced to ensure no error is thrown.
 *
 * @param {string} path - The path to the directory that needs to be removed.
 */
export const removeDirectory = (path: string): void => {
    if (existsSync(path)) rmSync(path, {recursive: true, force: true});
};
