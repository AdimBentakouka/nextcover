import {Injectable, Logger} from '@nestjs/common';
import {GoogleBooksMetadataStrategy} from './strategies/google-books-metadata.strategy';
import {AppEvents} from '../utils/event-constants';
import {OnEvent} from '@nestjs/event-emitter';
import {messages} from '../utils/messages';
import {getFileInfo} from '../utils/file-utils';

export enum MetadataStrategies {
    GOOGLE_BOOKS = 'Google Books API',
}

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
export class MetadataService {
    private readonly logger = new Logger(MetadataService.name, {
        timestamp: true,
    });

    private scanCompleted: boolean = false;
    private unprocessedFilePath: FileInfo[] = [];

    constructor(
        private readonly googleBookMetadataStrategy: GoogleBooksMetadataStrategy,
    ) {}

    create(filePath: string): void {
        const fileInfo = this.safeGetFileInfo(filePath);

        if (!fileInfo) return;

        if (!this.scanCompleted) {
            this.unprocessedFilePath.push(fileInfo);
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
            title: 'Todo',
            ...fileInfo,
        };
    }
}
