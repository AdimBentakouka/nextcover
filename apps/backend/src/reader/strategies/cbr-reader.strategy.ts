import {
    BasicMetadata,
    GetPageParams,
    ReaderStrategy,
} from '../interfaces/reader-strategy.interface';
import {openFile} from '../../utils/file-utils';
import {
    createExtractorFromData,
    type Extractor,
    FileHeader,
} from 'node-unrar-js';
import {processImageBufferToArrayBuffer} from '../../utils/sharp';
import {messages} from '../../utils/messages';

const IMAGE_EXTENSIONS = ['.jpg', '.png', '.jpeg'];

/**
 * Represents a strategy for reading CBR or RAR (Comic Book RAR) files.
 * This strategy is responsible for extracting and reading comic book pages from CBR or RAR files.
 */

export class CbrReaderStrategy implements ReaderStrategy {
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
        const rarInstance = await this.createRarInstance(filePath);
        const sortedImageEntries = this.getSortedImageEntries(rarInstance);

        if (
            startPage <= 0 ||
            startPage + pageCount > sortedImageEntries.length
        ) {
            throw new Error(
                messages.errors.INVALID_NUMBER_PAGES.replace(
                    '{maxPage}',
                    sortedImageEntries.length.toString(),
                ),
            );
        }

        const fileHeaders: FileHeader[] = [];

        for (
            let indexPage = startPage;
            indexPage < startPage + pageCount;
            indexPage++
        ) {
            fileHeaders.push(sortedImageEntries[indexPage - 1]);
        }

        return await this.extractPage(rarInstance, fileHeaders);
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
        const rarInstance = await this.createRarInstance(filePath);

        const sortedImageEntries = this.getSortedImageEntries(rarInstance);

        return {
            countPages: sortedImageEntries.length,
            cover: thumbnail
                ? undefined
                : (
                      await this.extractPage(rarInstance, [
                          sortedImageEntries[0],
                      ])
                  )[0],
        };
    }

    /**
     * Retrieves a sorted list of image file entries from the provided RAR extractor instance.
     *
     * @param {Extractor<Uint8Array<ArrayBufferLike>>} rar - The instance of the RAR extractor containing the file entries to process.
     * @return {FileHeader[]} An array of file headers sorted alphabetically by file name, excluding directory entries.
     */
    private getSortedImageEntries(
        rar: Extractor<Uint8Array<ArrayBufferLike>>,
    ): FileHeader[] {
        const rarEntries = rar.getFileList();

        const fileHeaders = [...rarEntries.fileHeaders];

        return fileHeaders
            .filter(
                (header) =>
                    !header.flags.directory && this.isImageFile(header.name),
            )
            .sort((a, b) => a.name.localeCompare(b.name));
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
     * Extracts specific pages from a RAR archive and processes their content into array buffers.
     *
     * @param {Extractor<Uint8Array<ArrayBufferLike>>} rar The extractor instance responsible for handling the RAR archive.
     * @param {FileHeader[]} pages An array of file headers indicating the pages to be extracted from the archive.
     *
     * @return {Promise<Array<ArrayBuffer>>} A promise resolving to an array of processed array buffers corresponding to the extracted pages.
     */
    private async extractPage(
        rar: Extractor<Uint8Array<ArrayBufferLike>>,
        pages: FileHeader[],
    ): Promise<Array<ArrayBuffer>> {
        const extracted = rar.extract({
            files: [...pages.map((page) => page.name)],
        });

        const files = [...extracted.files];

        return Promise.all(
            files.map((file) =>
                processImageBufferToArrayBuffer(file.extraction),
            ),
        );
    }

    /**
     * Creates a RAR extraction instance from the provided file path.
     *
     * @param {string} filepath - The path to the file from which the RAR instance will be created.
     * @return {Promise<Object>} A promise that resolves to a RAR extractor instance initialized with the file data.
     */
    private async createRarInstance(
        filepath: string,
    ): Promise<Extractor<Uint8Array<ArrayBufferLike>>> {
        const bufferFile = Uint8Array.from(openFile(filepath)).buffer;

        return createExtractorFromData({
            data: bufferFile,
        });
    }
}
