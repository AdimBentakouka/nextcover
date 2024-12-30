import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Ebook} from './entities/ebook.entity';
import {LibrariesService} from '../libraries/libraries.service';
import {MetadataService} from '../metadata/metadata.service';
import {AppEvents} from '../utils/event-constants';
import {OnEvent} from '@nestjs/event-emitter';
import {getFileInfo} from '../utils/file-utils';
import {messages} from '../utils/messages';

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
const ALLOWED_FILE_EXTENSIONS = [
    '.epub',
    '.pdf',
    '.cbz',
    '.cbr',
    '.zip',
    '.rar',
];

@Injectable()
export class EbookService {
    private readonly logger = new Logger(EbookService.name, {
        timestamp: true,
    });

    private scanCompleted: boolean = false;
    private unprocessedFilePath: FileInfo[] = [];

    constructor(
        @InjectRepository(Ebook)
        private readonly EbookRepository: Repository<Ebook>,
        private readonly librariesService: LibrariesService,
        private readonly metadataService: MetadataService,
    ) {}

    create(filePath: string): void {
        const fileInfo = this.safeGetFileInfo(filePath);

        if (!fileInfo) return;

        if (!this.scanCompleted) {
            this.unprocessedFilePath.push(fileInfo);
            // return;
        }

        // getMetadata

        // Generate minima miniature si non existante

        // créer ebooks
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
    remove(filepath: string): void {}

    /**
     * Handles the event when the initial folder scan is completed.
     * Performs actions such as creating and deleting bulk entries as part of post-scan handling.
     *
     * @return {void}
     */
    @OnEvent(AppEvents.WATCH_FOLDER_INITIAL_SCAN_COMPLETED)
    private onScanCompleted(): void {
        this.scanCompleted = true;

        console.log(this.unprocessedFilePath);
        // CreateBulk

        // DeleteBulk
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
    ): (FileInfo & {title: string}) | null {
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

        return {
            title: this.extractTitle(fileInfo.fileName),
            ...fileInfo,
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
                .trim()
        );
    }
}
