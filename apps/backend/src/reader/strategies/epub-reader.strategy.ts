import {GetPageParams, type ReaderStrategy} from '../interfaces/reader-strategy.interface';
import {EPub} from 'epub2';
import {NotFoundException} from '@nestjs/common';
import {messages} from '../../utils/messages';

/**
 * Class representing a strategy for reading EPUB files. Implements the ReaderStrategy interface.
 */
export class EpubReaderStrategy implements ReaderStrategy {
    /**
     * Retrieves the content of a specific page from a given file.
     *
     * @return {Promise<string>} A promise that resolves to the content of the requested page as a string.
     */
    async getPage({filePath, startPage}: GetPageParams): Promise<string> {
        const adjustedPageNumber = startPage - 1;
        const epub = await this.createEpubInstance(filePath);
        const chapters = epub.flow;

        if (adjustedPageNumber >= chapters.length || adjustedPageNumber < 0) {
            throw new Error(
                messages.errors.INVALID_NUMBER_PAGES.replace(
                    '{maxPage}',
                    chapters.length.toString(),
                ),
            );
        }
        return epub.getChapterAsync(chapters[adjustedPageNumber].id);
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
                messages.errors.COVER_NOT_FOUND.replace(
                    '{title}',
                    epub.metadata.title,
                ),
            );

        const [coverImage] = await epub.getImageAsync(coverImageId);
        return coverImage;
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
