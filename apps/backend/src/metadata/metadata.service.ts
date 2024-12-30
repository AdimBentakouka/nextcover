import {Injectable, Logger} from '@nestjs/common';
import {GoogleBooksMetadataStrategy} from './strategies/google-books-metadata.strategy';
import {messages} from '../utils/messages';

export enum MetadataStrategies {
    GOOGLE_BOOKS = 'Google Books API',
}

@Injectable()
export class MetadataService {
    private readonly logger = new Logger(MetadataService.name, {
        timestamp: true,
    });

    constructor(
        private readonly googleBookMetadataStrategy: GoogleBooksMetadataStrategy,
    ) {}

    /**
     * Retrieves the metadata strategy based on the provided strategy type.
     *
     * @param {MetadataStrategies} metadataStrategy - The metadata strategy type to be used.
     * @return {Object} The corresponding metadata strategy implementation.
     */
    private getMetadataStrategy(metadataStrategy: MetadataStrategies) {
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
