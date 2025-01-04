import sharp from 'sharp';
import {mkdirSync} from 'fs';
import {dirname} from 'path';

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
 * Asynchronously creates an image file in WebP format at a specified file path.
 *
 * @param {string} filePath - The path where the WebP image file will be saved.
 * @param {ArrayBuffer} imageBuffer - The image data to be converted and saved as a WebP file.
 * @param {(err: any) => void} onError - Optional callback invoked on errors.
 * @returns {Promise<string | undefined>} A promise that resolves to the file path if successful, or `undefined` on failure.
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
        mkdirSync(dirname(filePath), {recursive: true});

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
