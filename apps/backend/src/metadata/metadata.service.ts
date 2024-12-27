import { Injectable, Logger } from '@nestjs/common';
import { MetadataStrategy } from './interfaces/metadata-strategy.interface';
import { GoogleBooksMetadataStrategy } from './strategies/google-books-metadata.strategy';
import { NextCoverMetadataStrategy } from './strategies/nextcover-metadata.strategy';

export enum MetadataStrategies {
    GOOGLE_BOOKS = 'Google Books API',
    NEXTCOVER = 'NextCover Generator',
}

@Injectable()
export class MetadataService {
    private readonly logger = new Logger(MetadataService.name, {
        timestamp: true,
    });

    constructor(
        private readonly googleBookMetadataStrategy: GoogleBooksMetadataStrategy,
        private readonly NextcoverMetadataStrategy: NextCoverMetadataStrategy,
    ) {}

    getMetadataStrategy(strategyName: MetadataStrategies): MetadataStrategy {
        switch (strategyName) {
            case MetadataStrategies.GOOGLE_BOOKS:
                return this.googleBookMetadataStrategy;
            case MetadataStrategies.NEXTCOVER:
                return this.NextcoverMetadataStrategy;
            default:
                throw new Error(`Unknown metadata strategy: ${strategyName}`);
        }
    }

    async generateMetadata(
        name: string,
        strategy: MetadataStrategies,
    ): Promise<any> {
        return this.getMetadataStrategy(strategy).findMetadata(name);
    }
}
