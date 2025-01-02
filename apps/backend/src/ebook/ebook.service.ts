import {Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {In, Not, Repository} from 'typeorm';
import {Ebook} from './entities/ebook.entity';
import {LibrariesService} from '../libraries/libraries.service';
import {MetadataAPIService} from '../metadataAPI/metadataAPI.service';
import {AppEvents} from '../utils/event-constants';
import {OnEvent} from '@nestjs/event-emitter';
import {checkPathExists, getFileInfo} from '../utils/file-utils';
import {messages} from '../utils/messages';
import {Library} from '../libraries/entities/library.entity';
import {ReaderService} from '../reader/reader.service';
import {rmSync} from 'node:fs';

/**
 * A constant array that defines the list of allowed file extensions for processing.
 *
 * The supported file extensions are:
 * - `.epub`: Common eBook format for digital publications.
 * - `.pdf`: Portable Document Format, widely used for documents.
 * - `.cbz`: Comic Book Archive file in ZIP format.
 * - `.cbr`: Comic Book Archive file in RAR format.
 * - `.zip`: Compressed archive file in ZIP format.
 * - `.rar`: Compressed archive file in RAR format.
 */
const ALLOWED_FILE_EXTENSIONS = ['.epub', '.cbz', '.cbr', '.zip', '.rar'];

/**
 * EbookService handles operations related to e-books, including creation, updating,
 * metadata management, and interactions with e-book libraries. It also processes
 * events related to library updates and folder scans.
 */
@Injectable()
export class EbookService implements OnModuleInit {
    private readonly logger = new Logger(EbookService.name, {
        timestamp: true,
    });

    private scanCompleted: boolean = false;
    private unprocessedFilePath: FileInfo[] = [];
    private libraries: Library[] = [];

    constructor(
        @InjectRepository(Ebook)
        private readonly EbookRepository: Repository<Ebook>,
        private readonly librariesService: LibrariesService,
        private readonly metadataService: MetadataAPIService,
        private readonly readerService: ReaderService,
    ) {}

    async onModuleInit() {
        this.libraries = await this.librariesService.findAll();
    }

    /**
     * Creates a new ebook entry from the specified file path.
     *
     * @param {string} filePath - The path of the file to create an ebook entry from.
     * @return {Promise<void>} A promise that resolves once the ebook entry is created and saved.
     */
    async create(filePath: string): Promise<void> {
        const fileInfo = this.safeGetFileInfo(filePath);

        if (!fileInfo) return;

        // if scan processing, add file into list of file processing
        if (!this.scanCompleted) {
            this.unprocessedFilePath.push(fileInfo);
            return;
        }

        try {
            const metadata = await this.getCompleteMetadata(fileInfo);

            const ebook = await this.createAndSaveEbook(fileInfo, metadata);

            return this.logger.log(
                messages.success.EBOOK_CREATED.replace('{title}', ebook.title),
            );
        } catch (error) {
            this.logger.error(error);
        }
    }

    /**
     * Updates the content or state based on the provided file path.
     *
     * @param {string} filepath - The file path to be updated or processed.
     * @return {void} This method does not return a value.
     */
    update(filepath: string): void {}

    /**
     * Removes a file at the specified file path.
     *
     * @param {string} filepath - The path of the file to be removed.
     * @return {void} Does not return any value.
     */
    async remove(filepath: string): Promise<void> {
        try {
            const ebook = await this.EbookRepository.findOne({
                where: {
                    filepath,
                },
            });

            if (ebook) {
                if (checkPathExists(filepath)) {
                    rmSync(filepath);
                }
                if (
                    !ebook.thumbnail.startsWith('https://') &&
                    checkPathExists(ebook.thumbnail)
                ) {
                    rmSync(ebook.thumbnail);
                }

                await this.EbookRepository.remove(ebook);
            }
        } catch (error) {
            this.logger.error(error);
        }
    }

    /**
     * Updates the libraries by fetching all available entries from the libraries service.
     * Trigger by **AppEvents.LIBRARIES_UPDATED**
     */
    @OnEvent(AppEvents.LIBRARIES_UPDATED)
    async refreshLibraries(): Promise<void> {
        this.libraries = await this.librariesService.findAll();
    }

    private async createAndSaveEbook(
        fileInfo: FileInfo & {title: string; library: Library},
        metadata: Metadata,
    ): Promise<Ebook> {
        const ebook = this.EbookRepository.create({
            ...fileInfo,
            ...metadata,
        });

        await this.EbookRepository.save(ebook);
        return ebook;
    }

    /**
     * Retrieves and completes metadata for the given file information. If the metadata
     * does not include a thumbnail, one is generated and added.
     *
     * @param {FileInfo & {library: Library}} fileInfo - An object containing file information
     *        and associated library details. The library includes metadata strategy.
     * @return {Promise<Metadata>} A promise that resolves to the complete metadata object
     *         including any generated thumbnail if necessary.
     */
    private async getCompleteMetadata(
        fileInfo: FileInfo & {library: Library},
    ): Promise<Metadata> {
        if (fileInfo.extension === 'epub') {
            const readerMetadata = await this.readerService.getMetadata({
                title: fileInfo.fileName,
                filePath: fileInfo.filepath,
            });

            if (readerMetadata.score === 0) {
                return readerMetadata;
            }

            const metadataAPI = await this.metadataService.getMetadata(
                fileInfo.fileName,
                fileInfo.library.metadataStrategy,
            );

            return {
                ...metadataAPI,
                ...readerMetadata,
            };
        }

        const metadataAPI = await this.metadataService.getMetadata(
            fileInfo.fileName,
            fileInfo.library.metadataStrategy,
        );

        const readerMetadata = await this.readerService.getMetadata({
            title: metadataAPI.title || fileInfo.fileName,
            filePath: fileInfo.filepath,
            thumbnail: metadataAPI.thumbnail || undefined,
        });

        return {
            ...metadataAPI,
            ...readerMetadata,
        };
    }

    /**
     * Handles the event when the initial folder scan is completed.
     * Performs actions such as creating and deleting bulk entries as part of post-scan handling.
     * Trigger by **AppEvents.WATCH_FOLDER_INITIAL_SCAN_COMPLETED**
     * @return {void}
     */
    @OnEvent(AppEvents.WATCH_FOLDER_INITIAL_SCAN_COMPLETED)
    private async onScanCompleted(): Promise<void> {
        this.scanCompleted = true;

        const ebooks = await this.EbookRepository.find();

        const ebooksNotCreated = this.unprocessedFilePath.filter(
            ({filepath}) =>
                !ebooks.find(
                    ({filepath: ebookFilePath}) => ebookFilePath === filepath,
                ),
        );

        await Promise.all(
            ebooksNotCreated.map(({filepath}) => this.create(filepath)),
        );

        const ebooksToDelete = await this.EbookRepository.find({
            where: {
                filepath: Not(
                    In(this.unprocessedFilePath.map(({filepath}) => filepath)),
                ),
            },
        });

        await Promise.all(
            ebooksToDelete.map((ebook) => this.remove(ebook.filepath)),
        );
    }

    /**
     * Checks if the provided file name has an allowed file extension.
     *
     * @return {boolean} Returns true if the file has an allowed extension, otherwise false.
     * @param extension
     */
    private isAllowedFileExtension(extension: string): boolean {
        return ALLOWED_FILE_EXTENSIONS.includes(extension);
    }

    /**
     * Safely retrieves file information if the file has an allowed extension.
     *
     * @param {string} filepath - The path of the file to retrieve information for.
     * @return {FileInfo | null} Returns the file information if the file has an allowed extension; otherwise, returns null.
     */
    private safeGetFileInfo(
        filepath: string,
    ): (FileInfo & {title: string; library: Library}) | null {
        const fileInfo = getFileInfo(filepath);

        if (!this.isAllowedFileExtension(fileInfo.extension)) {
            if (this.scanCompleted)
                this.logger.warn(
                    messages.errors.FILE_EXTENSION_NOT_ALLOWED.replace(
                        '{fileName}',
                        filepath,
                    ),
                );

            return null;
        }

        const library = this.libraries.find((lib) =>
            fileInfo.filepath.startsWith(lib.path),
        );

        return {
            title: this.extractTitle(fileInfo.fileName),
            ...fileInfo,
            library,
        };
    }

    /**
     * Extracts a formatted title from a given file name by performing transformations such as removing underscores,
     * eliminating bracketed content, and converting specific abbreviations to full text.
     *
     * @param {string} fileName - The original file name to be transformed into a formatted title.
     * @return {string} - The extracted and formatted title.
     */
    private extractTitle(fileName: string): string {
        return (
            fileName
                // Removes underscores from the file name
                .replaceAll('_', ' ')
                // Removes groups of characters enclosed in brackets or parentheses
                .replace(/(\[.*?]|\(.*?\))/g, '')
                // Converts Tome abbreviations (e.g., TXX) to full text
                .replace(/\bT(\d{2})\b/g, 'Tome $1')
                .replace(/(\D)0(\d)/g, '$1$2')
                .trim()
        );
    }
}
