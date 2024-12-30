import {existsSync} from 'fs';
import {basename, dirname, extname} from 'path';

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
        directoryName: basename(dirname(filePath)),
    };
};
