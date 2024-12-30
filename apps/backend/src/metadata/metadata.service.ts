import {Injectable} from '@nestjs/common';
import {GoogleBooksMetadataStrategy} from './strategies/google-books-metadata.strategy';
import {messages} from '../utils/messages';
import {MetadataStrategy} from './interfaces/metadata-strategy.interface';

export enum MetadataStrategies {
    GOOGLE_BOOKS = 'Google Books API',
}

@Injectable()
export class MetadataService {
    constructor(
        private readonly googleBookMetadataStrategy: GoogleBooksMetadataStrategy,
    ) {}

    /**
     * Retrieves metadata for a given title using the specified metadata strategy.
     *
     * @param {string} title - The title for which metadata needs to be retrieved.
     * @param {MetadataStrategies} metadataStrategy - The strategy to use for fetching metadata.
     */
    async getMetadata(
        title: string,
        metadataStrategy: MetadataStrategies,
    ): Promise<Metadata> {
        return await this.getMetadataStrategy(metadataStrategy).findMetadata(
            title,
        );
    }

    async generateThumbnail(filepath: string, extension: string) {
        // read first page

        // generate name file for thumbnail

        // save blob to .jpg into /public/cover/**.jpg

        return '#TODO Generate thumbnail';
    }

    /**
     * Retrieves the metadata strategy based on the provided strategy type.
     *
     * @param {MetadataStrategies} metadataStrategy - The metadata strategy type to be used.
     * @return {Object} The corresponding metadata strategy implementation.
     */
    private getMetadataStrategy(
        metadataStrategy: MetadataStrategies,
    ): MetadataStrategy {
        switch (metadataStrategy) {
            case MetadataStrategies.GOOGLE_BOOKS:
                return this.googleBookMetadataStrategy;
            default:
                throw new Error(
                    messages.errors.UNKNOWN_METADATA_STRATEGY.replace(
                        '{metadataStrategy}',
                        metadataStrategy,
                    ),
                );
        }
    }
}
