import * as sharp from 'sharp';
import {mkdirSync} from 'fs';
import {dirname} from 'path';

/**
 * Converts an image buffer to the WebP format.
 *
 * @param {ArrayBuffer} buffer - The input buffer containing image data.
 * @returns {Promise<Buffer>} A promise that resolves to a buffer containing the image in WebP format.
 */
export const convertImageToWebp = (buffer: ArrayBuffer) => {
    return sharp(buffer).webp({lossless: true}).toBuffer();
};

/**
 * Asynchronously creates an image file in WebP format at a specified file path.
 *
 * @param {Object} options An object containing the parameters required for creating the image file.
 * @param {string} options.filePath The path where the image file will be created.
 * @param {ArrayBuffer} options.image The image data to be converted and saved as a WebP file.
 * @param {Function} [options.onError] An optional callback function invoked when an error occurs. Receives the error as an argument.
 */
export const createImageFile = async ({
    filePath,
    image,
    onError,
}: {
    filePath: string;
    image: ArrayBuffer;
    onError?: (err: any) => void;
}): Promise<void> => {
    try {
        mkdirSync(dirname(filePath), {recursive: true});

        const convertBuffer = await convertImageToWebp(image);

        sharp(convertBuffer)
            .toFile(filePath)
            .catch((err) => {
                if (onError) onError(err);
            });
    } catch (e) {
        if (onError) onError(e);
    }
};
