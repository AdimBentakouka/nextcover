import {Injectable, Logger} from '@nestjs/common';
import {EpubReaderStrategy} from './strategies/epub-reader.strategy';
import {PdfReaderStrategy} from './strategies/pdf-reader.strategy';
import {CbrReaderStrategy} from './strategies/cbr-reader.strategy';
import {CbzReaderStrategy} from './strategies/cbz-reader.strategy';
import {randomUUID} from 'node:crypto';
import {ReaderStrategy} from './interfaces/reader-strategy.interface';
import {messages} from '../utils/messages';
import {getExtension} from '../utils/file-utils';
import {createImageFile} from '../utils/sharp';

const FOLDER_COVER = './public/covers';

@Injectable()
export class ReaderService {
    private readonly logger = new Logger(ReaderService.name, {timestamp: true});

    constructor(
        private readonly cbzReaderStrategy: CbzReaderStrategy,
        private readonly cbrReaderStrategy: CbrReaderStrategy,
        private readonly pdfReaderStrategy: PdfReaderStrategy,
        private readonly EpubReaderStrategy: EpubReaderStrategy,
    ) {}

    /**
     * Retrieves metadata from the provided file.
     *
     * @param {string} filePath - The path of the file for which metadata is to be fetched.
     * @return {Promise<Metadata>} A promise resolving to the metadata object, including a thumbnail if the file has a cover.
     */
    async getMetadata(filePath: string): Promise<Metadata> {
        const strategy = this.selectStrategy(getExtension(filePath));

        if (!strategy?.getMetadata) {
            throw new Error(
                messages.errors.NOT_IMPLEMENTED.replace(
                    '{functionName}',
                    'getMetadata',
                ),
            );
        }

        const {cover, ...rest} = await strategy.getMetadata(filePath);

        const thumbnail = this.createCoverFile(cover);

        return {...rest, thumbnail};
    }

    /**
     * Creates a cover file from the given image data and stores it in the designated directory.
     *
     * @param {ArrayBuffer} image - The binary data of the image to be saved as a cover file.
     * @return {string | undefined} The file path of the saved cover file if successful, or undefined if the image data is not provided.
     */
    private createCoverFile(image: ArrayBuffer): string | undefined {
        if (!image) return undefined;

        const fileName = randomUUID();
        const coverPath = `${FOLDER_COVER}/${fileName}.webp`;

        createImageFile({
            filePath: coverPath,
            image: image,
            onError: (e) => this.logger.warn(e),
        }).then(() =>
            this.logger.log(
                messages.success.COVER_CREATED.replace('{path}', coverPath),
            ),
        );

        return coverPath;
    }

    /**
     * Selects and returns the appropriate reader strategy based on the given file extension.
     *
     * @param {string} strategy - The file extension representing the type of reader strategy to use.
     * @return {ReaderStrategy} The corresponding reader strategy for the given file extension.
     */
    private selectStrategy(strategy: string): ReaderStrategy {
        switch (strategy) {
            case '.epub':
                return this.EpubReaderStrategy;
            case '.pdf':
                return this.pdfReaderStrategy;
            case '.cbr':
            case '.rar':
                return this.cbrReaderStrategy;
            case '.cbz':
            case '.zip':
                return this.cbzReaderStrategy;
            default:
                throw new Error(
                    messages.errors.UNKNOWN_READER.replace(
                        '{reader}',
                        strategy,
                    ),
                );
        }
    }
}
