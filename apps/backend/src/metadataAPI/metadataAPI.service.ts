import {Injectable} from '@nestjs/common';
import {GoogleBooksMetadataAPIStrategy} from './strategies/google-books-metadataAPI.strategy';
import {messages} from '../utils/messages';
import {MetadataStrategy} from './interfaces/metadataAPI-strategy.interface';

export enum MetadataStrategies {
    GOOGLE_BOOKS = 'Google Books API',
}

@Injectable()
export class MetadataAPIService {
    constructor(
        private readonly googleBookMetadataStrategy: GoogleBooksMetadataAPIStrategy,
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
            this.extractTitle(title),
        );
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
