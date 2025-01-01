import {BasicMetadata, GetPageParams, ReaderStrategy} from '../interfaces/reader-strategy.interface';
import {openFile} from '../../utils/file-utils';
import {createExtractorFromData, type Extractor, FileHeader} from 'node-unrar-js';
import {processImageBufferToArrayBuffer} from '../../utils/sharp';
import {messages} from '../../utils/messages';

/**
 * Represents a strategy for reading CBR or RAR (Comic Book RAR) files.
 * This strategy is responsible for extracting and reading comic book pages from CBR or RAR files.
 */

export class CbrReaderStrategy implements ReaderStrategy {
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

    private async extractPage(
        rar: Extractor<Uint8Array<ArrayBufferLike>>,
        pages: FileHeader[],
    ) {
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

    private getSortedImageEntries(
        rarInstance: Extractor<Uint8Array<ArrayBufferLike>>,
    ): FileHeader[] {
        const rarEntries = rarInstance.getFileList();

        return [...rarEntries.fileHeaders]
            .filter((header) => !header.flags.directory)
            .sort((a, b) => a.name.localeCompare(b.name));
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
