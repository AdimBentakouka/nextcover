import sharp from 'sharp';
import {createDirectory, directoryPath} from './file-utils';

const initializeSharp = (): void => {
    sharp.cache(false);
};

initializeSharp();

/**
 * Converts an image buffer to the WebP format.
 *
 * @param {ArrayBuffer} buffer - The input buffer containing image data.
 * @returns {Promise<Buffer>} A promise that resolves to a buffer containing the image in WebP format.
 */
export const convertToWebp = (buffer: ArrayBuffer): Promise<Buffer> => {
    return sharp(buffer).webp({lossless: true}).toBuffer();
};

/**
 * Creates an image file from a given buffer and saves it to the specified file path.
 * The image buffer is converted to the WebP format before being saved.
 *
 * @param {Object} params - The parameters for creating the image file.
 * @param {string} params.filePath - The file path where the image will be saved.
 * @param {ArrayBuffer} params.imageBuffer - The image data in buffer format.
 * @param {Function} [params.onError] - Optional callback function invoked with the error object if an error occurs.
 * @returns {Promise<string | undefined>} A promise resolving to the file path of the created image, or undefined if the buffer is invalid.
 */
export const createImageFile = async ({
    filePath,
    imageBuffer,
    onError,
}: {
    filePath: string;
    imageBuffer: ArrayBuffer;
    onError?: (err: any) => void;
}): Promise<string | undefined> => {
    try {
        if (!imageBuffer) return undefined;
        createDirectory(directoryPath(filePath));

        const convertBuffer = await convertToWebp(imageBuffer);

        sharp(convertBuffer)
            .toFile(filePath)
            .catch((err) => {
                if (onError) onError(err);
            });
    } catch (e) {
        if (onError) onError(e);
    }
};

/**
 * Processes an image buffer and converts it to an ArrayBuffer.
 * @returns {Promise<ArrayBuffer>} A promise resolving to the processed buffer.
 **/
export const processImageBufferToArrayBuffer = (
    buffer: Uint8Array<ArrayBuffer>,
): Promise<ArrayBuffer> => {
    return sharp(buffer).toBuffer();
};
