import {
    type BasicMetadata,
    type GetPageParams,
    type ReaderStrategy,
} from '../interfaces/reader-strategy.interface';
import StreamZip, {type ZipEntry} from 'node-stream-zip';
import {messages} from '../../utils/messages';

const IMAGE_EXTENSIONS = ['.jpg', '.png', '.jpeg'];

/**
 * A concrete implementation of the ReaderStrategy interface for handling CBZ or ZIP (Comic Book Zip) files.
 * This strategy is responsible for extracting and reading comic book pages from CBZ or ZIP files.
 */
export class CbzReaderStrategy implements ReaderStrategy {
    /**
     * Retrieves a specified range of pages as an array of ArrayBuffers.
     *
     * @param {Object} params - The parameters for retrieving pages.
     * @param {string} params.filePath - The file path to locate the zip archive containing the pages.
     * @param {number} params.startPage - The starting page number to retrieve.
     * @param {number} params.pageCount - The number of pages to retrieve starting from the startPage.
     * @return {Promise<ArrayBuffer[]>} A promise that resolves to an array of ArrayBuffer objects representing the requested pages.
     */
    async getPage({
        filePath,
        startPage,
        pageCount,
    }: GetPageParams): Promise<ArrayBuffer[]> {
        const pageBuffers: ArrayBuffer[] = [];
        const zipInstance = await this.createZipInstance(filePath);
        const pages = this.getSortedImageEntries(zipInstance);

        if (startPage <= 0 || startPage + pageCount > pages.length) {
            throw new Error(
                messages.errors.INVALID_NUMBER_PAGES.replace(
                    '{maxPage}',
                    pages.length.toString(),
                ),
            );
        }

        for (
            let indexPage = startPage;
            indexPage < startPage + pageCount;
            indexPage++
        ) {
            pageBuffers.push(
                this.extractPage(zipInstance, pages[indexPage - 1]),
            );
        }

        zipInstance.close();

        return pageBuffers;
    }

    /**
     * Extracts metadata from the specified file.
     *
     * @param {string} filePath - The path of the file from which metadata needs to be extracted.
     * @param {string} [thumbnail] - An optional thumbnail to use as the cover image.
     * @return {Promise<BasicMetadata>} A promise that resolves to an object containing the metadata, including the page count and cover information.
     */
    async extractMetadata(
        filePath: string,
        thumbnail?: string,
    ): Promise<BasicMetadata> {
        const zipInstance = await this.createZipInstance(filePath);
        const pages = this.getSortedImageEntries(zipInstance);

        zipInstance.close();

        return {
            countPages: pages.length,
            cover: thumbnail
                ? undefined
                : this.extractPage(zipInstance, pages[0]),
        };
    }

    /**
     * Retrieves and sorts image file entries from a provided zip archive.
     *
     * @param {StreamZip} zip - The zip file object containing entries to be filtered and sorted.
     * @return {ZipEntry[]} A promise that resolves to an array of sorted image file entries.
     */
    private getSortedImageEntries(zip: StreamZip): ZipEntry[] {
        const zipEntries = Object.values(zip.entries());

        const imageEntries = zipEntries.filter((entry) =>
            this.isImageFile(entry.name),
        );

        return imageEntries.sort((a, b) => a.name.localeCompare(b.name));
    }

    /**
     * Checks if the provided file name corresponds to an image file based on its extension.
     *
     * @param {string} fileName - The name of the file to check.
     * @return {boolean} Returns true if the file has an image file extension, false otherwise.
     */
    private isImageFile(fileName: string): boolean {
        return IMAGE_EXTENSIONS.some((extension) =>
            fileName.endsWith(extension),
        );
    }

    /**
     * Extracts the data of a specific page from a zip archive.
     *
     * @param {StreamZip} zip - The zip archive object containing the desired page.
     * @param {ZipEntry} page - The specific entry representing the page to be extracted.
     * @return {ArrayBuffer} The content of the page as an ArrayBuffer.
     *
     */
    private extractPage(zip: StreamZip, page: ZipEntry): ArrayBuffer {
        return zip.entryDataSync(page.name);
    }

    /**
     * Creates and initializes a StreamZip instance for the provided file path.
     *
     * @param {string} filepath - The path to the zip file to be processed.
     * @return {Promise<StreamZip>} A promise that resolves with the StreamZip instance
     * representing the zip file or rejects with an error if the process fails.
     */
    private async createZipInstance(filepath: string): Promise<StreamZip> {
        return new Promise((resolve, reject) => {
            const zip = new StreamZip({
                file: filepath,
                storeEntries: true,
            });

            zip.on('ready', () => {
                resolve(zip);
            });
            zip.on('error', (err) => {
                console.log(err);
                reject(err);
            });
        });
    }
}
