import {ConflictException, Injectable} from '@nestjs/common';
import {EpubReaderStrategy} from './strategies/epub-reader.strategy';
import {CbrReaderStrategy} from './strategies/cbr-reader.strategy';
import {CbzReaderStrategy} from './strategies/cbz-reader.strategy';
import {
    type Chapter,
    type GetPageParams,
    type ReaderStrategy,
} from './interfaces/reader-strategy.interface';
import {messages} from '../utils/messages';
import {getExtension} from '../utils/file-utils';

@Injectable()
export class ReaderService {
    constructor(
        private readonly cbzReaderStrategy: CbzReaderStrategy,
        private readonly cbrReaderStrategy: CbrReaderStrategy,
        private readonly EpubReaderStrategy: EpubReaderStrategy,
    ) {}

    /**
     * Retrieves metadata from the provided file.
     * @param title - Name of book
     * @param filePath - filepath of book
     * @param thumbnail - thumbnail filepath
     * @return {Promise<Metadata>} A promise resolving to the metadata object, including a thumbnail if the file has a cover.
     */
    async getMetadata({
        title,
        filePath,
        thumbnail,
    }: {
        title: string;
        filePath: string;
        thumbnail?: string;
    }): Promise<ExtendedMetadata | (BasicMetadata & {title: string})> {
        const strategy = this.selectStrategy(getExtension(filePath));

        if (!strategy?.extractMetadata) {
            throw new Error(messages.errors.notImplemented('extractMetadata'));
        }

        const metadata = await strategy.extractMetadata(filePath, thumbnail);

        return {title, ...metadata};
    }

    /**
     * Fetches the pages based on the specified parameters using an appropriate strategy.
     *
     * @param {GetPageParams} params - The parameters required for fetching the pages, including the file path and other relevant details.
     * @return {Promise<ArrayBuffer | string>} A promise that resolves to the pages in the form of an ArrayBuffer or a string.
     */
    async getPages(params: GetPageParams): Promise<ArrayBuffer | string> {
        const strategy = this.selectStrategy(getExtension(params.filePath));

        if (!strategy?.getPage) {
            throw new Error(messages.errors.notImplemented('getPage'));
        }

        return await strategy.getPage(params);
    }

    /**
     * Retrieves the chapters from a given file using the appropriate strategy based on the file's extension.
     *
     * @param {string} filePath - The path to the file from which chapters are to be retrieved.
     * @return {Promise<Chapter[]>} A promise that resolves to an array of Chapter objects extracted from the file.
     */
    async getChapters(filePath: string): Promise<Chapter[]> {
        const strategy = this.selectStrategy(getExtension(filePath));
        if (!strategy?.getChapters) {
            throw new ConflictException(
                messages.errors.notImplemented('getChapters'),
            );
        }

        return await strategy.getChapters(filePath);
    }

    /**
     * Selects and returns the appropriate reader strategy based on the given file extension.
     *
     * @param {string} reader - The file extension representing the type of reader strategy to use.
     * @return {ReaderStrategy} The corresponding reader strategy for the given file extension.
     */
    private selectStrategy(reader: string): ReaderStrategy {
        switch (reader) {
            case '.epub':
                return this.EpubReaderStrategy;
            case '.cbr':
            case '.rar':
                return this.cbrReaderStrategy;
            case '.cbz':
            case '.zip':
                return this.cbzReaderStrategy;
            default:
                throw new Error(messages.errors.reader.unknownReader(reader));
        }
    }
}
