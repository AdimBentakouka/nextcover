import {Injectable, Logger, NotFoundException, OnModuleInit} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {In, MoreThan, Not, Repository} from 'typeorm';
import {Ebook} from './entities/ebook.entity';
import {LibrariesService} from '../libraries/libraries.service';
import {MetadataAPIService} from '../metadataAPI/metadataAPI.service';
import {AppEvents} from '../utils/event-constants';
import {OnEvent} from '@nestjs/event-emitter';
import {checkPathExists, getFileInfo, openFile, removeDirectory, removeFile} from '../utils/file-utils';
import {messages} from '../utils/messages';
import {Library} from '../libraries/entities/library.entity';
import {ReaderService} from '../reader/reader.service';
import {randomUUID} from 'node:crypto';
import {createImageFile} from '../utils/sharp';
import {ConfigService} from '@nestjs/config';
import {UpdateEbookDto} from './dto/update-ebook.dto';
import {type Chapter} from '../reader/interfaces/reader-strategy.interface';

/**
 * A constant array that defines the list of allowed file extensions for processing.
 *
 * The supported file extensions are:
 * - `.epub`: Common eBook format for digital publications.
 * - `.cbz`: Comic Book Archive file in ZIP format.
 * - `.cbr`: Comic Book Archive file in RAR format.
 * - `.zip`: Compressed archive file in ZIP format.
 * - `.rar`: Compressed archive file in RAR format.
 */
const ALLOWED_FILE_EXTENSIONS = ['.epub', '.cbz', '.cbr', '.zip', '.rar'];

/**
 * EbooksService handles operations related to e-books, including creation, updating,
 * metadata management, and interactions with e-book libraries. It also processes
 * events related to library updates and folder scans.
 */
@Injectable()
export class EbooksService implements OnModuleInit {
    private readonly logger = new Logger(EbooksService.name, {
        timestamp: true,
    });

    private scanCompleted: boolean = false;
    private unprocessedFilePath: FileInfo[] = [];
    private libraries: Library[] = [];

    constructor(
        @InjectRepository(Ebook)
        private readonly ebookRepository: Repository<Ebook>,
        private readonly librariesService: LibrariesService,
        private readonly metadataService: MetadataAPIService,
        private readonly readerService: ReaderService,
        private readonly configService: ConfigService,
    ) {}

    async onModuleInit() {
        this.libraries = await this.librariesService.findAll();
    }

    /**
     * Retrieves a list of eBooks from the repository that have a metadata score greater than zero, indicating unverified metadata.
     *
     * @return {Promise<Ebook[]>} A promise that resolves to an array of eBooks with unverified metadata.
     */
    async findEbooksWithUnverifiedMetadata(): Promise<Ebook[]> {
        return await this.ebookRepository.find({
            where: {
                score: MoreThan(0),
            },
        });
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

            return this.logger.log(messages.success.ebook.created(ebook.title));
        } catch (error) {
            this.logger.error(error);
        }
    }

    /**
     * Updates an existing ebook with the provided data and optional file.
     *
     * @param {string} id - The unique identifier of the ebook to update.
     * @param {updateEbookDto} updateEbookDto - Data transfer object containing the updated ebook details.
     * @param {Express.Multer.File} [file] - Optional file containing a new thumbnail or related ebook content.
     */
    async update(
        id: string,
        updateEbookDto: UpdateEbookDto,
        file?: Express.Multer.File,
    ): Promise<Ebook> {
        try {
            const ebook = await this.findOne(id);
            const {title} = updateEbookDto;

            if (file) {
                this.removeFileIfExists(ebook.filepath);

                const bufferImage = openFile(file.path);
                ebook.thumbnail = this.createCover(bufferImage);

                this.removeFileIfExists(file.path);
            }

            const newEbook = this.ebookRepository.merge(ebook, updateEbookDto, {
                score: 0,
            });

            const updateResult = await this.ebookRepository.save(newEbook);

            this.logger.log(
                messages.success.ebook.updated(title ?? ebook.title),
            );

            return updateResult;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**
     * Updates the metadata of an ebook located at the given file path.
     *
     * @param {string} filePath - The file path of the ebook whose metadata needs to be updated.
     * @return {Promise<Ebook>} A promise that resolves to the updated ebook entity.
     */
    async updateMetadataByFilePath(filePath: string): Promise<Ebook> {
        const ebook = await this.findOneByFilePath(filePath);

        return await this.updateMetadata(ebook);
    }

    /**
     * Updates the metadata of an Ebook by its identifier.
     *
     * @param {string} id - The unique identifier of the Ebook whose metadata needs to be updated.
     * @return {Promise<Ebook>} A promise that resolves to the updated Ebook instance.
     */
    async updateMetadataById(id: string): Promise<Ebook> {
        const ebook = await this.findOne(id);

        return await this.updateMetadata(ebook);
    }

    /**
     * Removes a file at the specified file path.
     *
     * @param {string} filepath - filepath of the ebook to be removed.
     */
    async remove(filepath: string): Promise<void> {
        try {
            const ebook = await this.ebookRepository.findOne({
                where: {
                    filepath,
                },
            });

            if (!ebook)
                throw new NotFoundException(
                    messages.errors.ebook.notFound(filepath),
                );

            this.removeFileIfExists(ebook.filepath);
            this.removeFileIfExists(ebook.thumbnail);

            await this.ebookRepository.remove(ebook);
        } catch (error) {
            this.logger.error(error);
        }
    }

    /**
     * Removes an ebook identified by the provided ID from the repository.
     *
     * @param {string} id - The unique identifier of the ebook to be removed.
     * @return {Promise<void>} A promise that resolves when the removal is complete.
     */
    async removeEbook(id: string): Promise<{message: string}> {
        const ebook = await this.ebookRepository.findOne({
            where: {
                id,
            },
        });

        if (!ebook) {
            throw new NotFoundException(messages.errors.ebook.notFound(id));
        }

        this.removeFileIfExists(ebook.filepath);

        removeDirectory(`./public/epub/${ebook.title}`);

        return {
            message: messages.success.ebook.deleted(ebook.title),
        };
    }

    /**
     * Retrieves a single ebook entity by its unique identifier.
     *
     * @param {string} id - The unique identifier of the ebook to retrieve.
     * @return { Promise<Ebook>} The ebook entity if found.
     */
    async findOne(id: string): Promise<Ebook> {
        const ebook = await this.ebookRepository.findOne({
            where: {
                id,
            },
        });

        if (!ebook) {
            throw new NotFoundException(messages.errors.ebook.notFound(id));
        }

        return ebook;
    }

    /**
     * Find and retrieve an ebook by it file path.
     *
     * @param {string} filepath - The file path of the ebook to locate.
     * @return {Promise<Ebook>} A promise that resolves to the found ebook.
     */
    async findOneByFilePath(filepath: string): Promise<Ebook> {
        const ebook = await this.ebookRepository.findOne({
            where: {
                filepath,
            },
        });

        if (!ebook) {
            throw new NotFoundException(
                messages.errors.ebook.notFound(filepath),
            );
        }

        return ebook;
    }

    /**
     * Retrieves the page content of an ebook based on the given ID and page number.
     *
     * @param {string} id - The unique identifier of the ebook.
     * @param {number} page - The page number to be retrieved.
     * @return {Promise<ArrayBuffer | string>} A promise that resolves to the content of the specified page
     * in either ArrayBuffer or string format.
     */
    async getPages(id: string, page: number): Promise<ArrayBuffer | string> {
        const ebook = await this.findOne(id);

        return await this.readerService.getPages({
            filePath: ebook.filepath,
            page,
        });
    }

    /**
     * Retrieves the chapters of an ebook based on the provided ID.
     *
     * @param {string} id - The unique identifier of the ebook.
     * @return {Promise<Chapter[]>} A promise that resolves to an array of chapters for the specified ebook.
     */
    async getChapters(id: string): Promise<Chapter[]> {
        const ebook = await this.findOne(id);

        return this.readerService.getChapters(ebook.filepath);
    }

    /**
     * Updates the libraries by fetching all available entries from the libraries service.
     * Trigger by **AppEvents.LIBRARIES_UPDATED**
     */
    @OnEvent(AppEvents.LIBRARIES_UPDATED)
    async refreshLibraries(): Promise<void> {
        this.libraries = await this.librariesService.findAll();
    }

    /**
     * Handles the event when the initial folder scan is completed.
     * Performs actions such as creating and deleting bulk entries as part of post-scan handling.
     * Trigger by **AppEvents.WATCH_FOLDER_INITIAL_SCAN_COMPLETED**
     * @return {Promise<void>}
     */
    @OnEvent(AppEvents.WATCH_FOLDER_INITIAL_SCAN_COMPLETED)
    async onScanCompleted(): Promise<void> {
        this.scanCompleted = true;

        const ebooks = await this.ebookRepository.find();

        const ebooksNotCreated = this.unprocessedFilePath.filter(
            ({filepath}) =>
                !ebooks.find(
                    ({filepath: ebookFilePath}) => ebookFilePath === filepath,
                ),
        );

        for (const ebook of ebooksNotCreated) {
            await this.create(ebook.filepath);
        }

        const ebooksToDelete = await this.ebookRepository.find({
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
     * Updates the metadata of the provided ebook object.
     *
     * This method retrieves the existing file information of the given ebook, merges
     * the newly retrieved metadata, and then saves the updated ebook to the repository.
     * If an error occurs during the process, it logs the error.
     *
     * @param {Ebook} ebook - The ebook object to be updated. It must contain a valid file path from which file information can be derived.
     * @return {Promise<Ebook>} A promise that resolves to the updated ebook object, or undefined if the file info is not found or an error occurs.
     */
    private async updateMetadata(ebook: Ebook): Promise<Ebook> {
        const fileInfo = this.safeGetFileInfo(ebook.filepath);

        if (!fileInfo) return;

        try {
            this.removeFileIfExists(ebook.thumbnail);

            const metadata = await this.getCompleteMetadata(fileInfo);

            const newEbook = this.ebookRepository.merge(ebook, metadata);

            const updatedResult = await this.ebookRepository.save(newEbook);

            this.logger.log(
                messages.success.ebook.updated(updatedResult.title),
            );

            return updatedResult;
        } catch (error) {
            this.logger.error(error);
        }
    }

    /**
     * Creates a new Ebook entity using the provided file information and metadata,
     * then saves it in the repository.
     *
     * @param {FileInfo & {title: string; library: Library}} fileInfo - The file information required to create the Ebook, including its title and associated library.
     * @param {Metadata} metadata - Additional metadata needed to create the Ebook.
     * @return {Promise<Ebook>} A promise that resolves to the created and saved Ebook entity.
     */
    private async createAndSaveEbook(
        fileInfo: FileInfo & {title: string; library: Library},
        metadata: Metadata,
    ): Promise<Ebook> {
        const ebook = this.ebookRepository.create({
            ...fileInfo,
            ...metadata,
        });

        return await this.ebookRepository.save(ebook);
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
                readerMetadata.thumbnail = this.createCover(
                    readerMetadata.cover,
                );
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

        if (readerMetadata.cover) {
            readerMetadata.thumbnail = this.createCover(readerMetadata.cover);
        }

        return {
            ...metadataAPI,
            ...readerMetadata,
        };
    }

    /**
     * Checks if the provided file extension is allowed.
     *
     * @param {string} extension - The file extension to be checked.
     * @return {boolean} Returns true if the file extension is allowed, otherwise false.
     */
    private isAllowedFileExtension(extension: string): boolean {
        return ALLOWED_FILE_EXTENSIONS.includes(extension);
    }

    /**
     * Safely retrieves file information if the file has an allowed extension.
     *
     * @param {string} filepath - The path of the file to retrieve information for.
     * @return {(FileInfo & {title: string; library: Library}) | null} Returns the file information if the file has an allowed extension; otherwise, returns null.
     */
    private safeGetFileInfo(
        filepath: string,
    ): (FileInfo & {title: string; library: Library}) | null {
        const fileInfo = getFileInfo(filepath);

        if (!this.isAllowedFileExtension(fileInfo.extension)) {
            if (this.scanCompleted)
                this.logger.warn(
                    messages.errors.file.extensionNotAllowed(filepath),
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

    /**
     * Creates a cover image file from the provided file buffer and saves it to a predefined folder.
     *
     * @param {ArrayBuffer} file The file buffer to be used for creating the cover image.
     * @return {string | undefined} The file path of the created cover image, or undefined if the input file is invalid.
     */
    private createCover(file: ArrayBuffer): string | undefined {
        if (!file) return undefined;

        const filePath = `${this.configService.get<string>('ASSETS_COVERS_FOLDER')}/${randomUUID()}.webp`;

        createImageFile({
            filePath: filePath,
            imageBuffer: file,
            onError: (e) => this.logger.warn(e),
        }).then(() => {
            this.logger.log(messages.success.ebook.coverCreated(filePath));
        });

        return filePath;
    }

    /**
     * Removes a file at the specified path if it exists and the path is not a URL.
     *
     * @param {string} path - The path to the file to be removed. The file will only be removed
     *                        if the path does not start with 'https://' and the file exists.
     * @return {void} This method does not return any value.
     */
    private removeFileIfExists(path: string): void {
        if (!path.startsWith('https://') && checkPathExists(path)) {
            removeFile(path);
        }
    }
}
