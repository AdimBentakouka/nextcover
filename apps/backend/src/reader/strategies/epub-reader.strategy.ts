import {
    type Chapter,
    type GetPageParams,
    type ReaderStrategy,
} from '../interfaces/reader-strategy.interface';
import {EPub} from 'epub2';
import {Injectable, NotFoundException} from '@nestjs/common';
import {messages} from '../../utils/messages';
import {TocElement} from 'epub2/lib/epub/const';
import {createFile, getFileInfo} from '../../utils/file-utils';
import {join} from 'path';
import {ConfigService} from '@nestjs/config';

const DEFAULT_PATH_EPUB = './public/epub/';

/**
 * Class representing a strategy for reading EPUB files. Implements the ReaderStrategy interface.
 */
@Injectable()
export class EpubReaderStrategy implements ReaderStrategy {
    constructor(private readonly configService: ConfigService) {}

    /**
     * Retrieves the content of a specific page from a given file.
     *
     * @return {Promise<string>} A promise that resolves to the content of the requested page as a string.
     */
    async getPage({filePath, page}: GetPageParams): Promise<string> {
        const adjustedPageNumber = page - 1;
        const epub = await this.createEpubInstance(filePath);
        const chapters = epub.flow;

        if (adjustedPageNumber >= chapters.length || adjustedPageNumber < 0) {
            throw new Error(
                messages.errors.reader.invalidRangePages(chapters.length),
            );
        }

        const chapter = chapters[adjustedPageNumber];

        let contentChapter = await epub.getChapterRawAsync(chapter.id);

        return this.updateAssetLinks(
            contentChapter,
            join(
                '/',
                this.configService.get<string>(
                    'ASSETS_EPUB_FOLDER',
                    DEFAULT_PATH_EPUB,
                ),
                epub.metadata.title,
                '/',
            ),
        );
    }

    /**
     * Retrieves metadata information and cover image data from an EPUB file.
     *
     * @param {string} filePath - Path to the EPUB file
     * @returns {Promise<Metadata & {cover: ArrayBuffer}>} Metadata with cover image as an ArrayBuffer.
     */
    async extractMetadata(
        filePath: string,
    ): Promise<Metadata & {cover: ArrayBuffer}> {
        const epub = await this.createEpubInstance(filePath);
        const coverImage = await this.extractCoverImage(epub);

        await this.extractAllFiles(epub);

        return {
            title: epub.metadata.title,
            authors: epub.metadata.creator.toString(),
            description: epub.metadata.description,
            isbn: epub.metadata.ISBN,
            score: 0,
            cover: coverImage,
            countPages: epub.flow.length,
        };
    }

    /**
     * Extracts the chapters from an EPUB file and returns an array of chapter information.
     *
     * @param {string} filePath - The file path to the EPUB file.
     * @return {Promise<{id: string, title: string}[]>} A promise that resolves to an array of objects, each containing the chapter id and title.
     */
    async getChapters(filePath: string): Promise<Chapter[]> {
        const epub = await this.createEpubInstance(filePath);
        const chapters = epub.flow;

        return chapters.map(({id, title}) => ({
            id,
            title,
        }));
    }

    /**
     * Extracts all files from the provided EPUB object and processes them accordingly.
     * Non-html files are saved based on their metadata and file information.
     * The processed files are stored in a configured EPUB assets folder.
     *
     * @param {EPub} epub - The EPUB object containing the manifest and metadata of the ebook.
     * @return {Promise<void>} A Promise that resolves when all files have been processed and extracted.
     */
    private async extractAllFiles(epub: EPub): Promise<void> {
        const {manifest, metadata} = epub;

        const processFile = async (
            manifestElement: TocElement,
        ): Promise<void> => {
            if (!manifestElement.href.includes('html')) {
                const fileData = await epub.getFileAsync(manifestElement.id);
                const fileInfo = getFileInfo(manifestElement.href);
                const outputFilePath = join(
                    this.configService.get<string>(
                        'ASSETS_EPUB_FOLDER',
                        DEFAULT_PATH_EPUB,
                    ),
                    metadata.title,
                    `${fileInfo.fileName}${fileInfo.extension}`,
                );

                createFile(outputFilePath, fileData[0]);
            }
        };

        for (const [_manifestKey, manifestElement] of Object.entries(
            manifest,
        )) {
            await processFile(manifestElement);
        }
    }

    /**
     * Extracts the cover image from the provided EPub object.
     *
     * @param {EPub} epub - The EPub instance from which the cover image will be extracted.
     * @return {Promise<ArrayBuffer>} A promise that resolves to the cover image data as an ArrayBuffer.
     */
    private async extractCoverImage(epub: EPub): Promise<ArrayBuffer> {
        const COVER_IDENTIFIER = 'cover';
        const coverImageId = epub
            .listImage()
            .find((image) => image.id.includes(COVER_IDENTIFIER))?.id;

        if (!coverImageId)
            throw new NotFoundException(
                messages.errors.reader.coverNotFound(epub.metadata.title),
            );

        const [coverImage] = await epub.getImageAsync(coverImageId);
        return coverImage;
    }

    /**
     * Remplace les URLs des assets par des chemins locaux
     */
    private updateAssetLinks(content: string, baseAssetsPath: string): string {
        // Remplace les images
        content = content.replace(
            /<img\s+[^>]*src=["']([^"']+)["']/g,
            (match, src) => {
                const localSrc = baseAssetsPath + src.split('/').pop(); // Utilise le fichier extrait
                return match.replace(src, localSrc);
            },
        );

        // Remplace les fichiers CSS
        content = content.replace(
            /<link\s+[^>]*href=["']([^"']+)["']/g,
            (match, href) => {
                const localHref = baseAssetsPath + href.split('/').pop();
                return match.replace(href, localHref);
            },
        );

        // Remplace les fichiers JS
        content = content.replace(
            /<script\s+[^>]*src=["']([^"']+)["']/g,
            (match, src) => {
                const localSrc = baseAssetsPath + src.split('/').pop();
                return match.replace(src, localSrc);
            },
        );

        return content;
    }

    /**
     * Initializes and parses an EPub instance from the given file path.
     *
     * @param filePath - Path to the EPUB file.
     * @returns A parsed EPub object.
     */
    private createEpubInstance(filePath: string): Promise<EPub> {
        return new Promise((resolve, reject) => {
            const epub = new EPub(filePath);

            epub.on('end', () => resolve(epub));
            epub.on('error', reject);

            epub.parse();
        });
    }
}
