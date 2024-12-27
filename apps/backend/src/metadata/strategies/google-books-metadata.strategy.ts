import { Injectable, Logger } from '@nestjs/common';
import { MetadataStrategy } from '../interfaces/metadata-strategy.interface';

@Injectable()
export class GoogleBooksMetadataStrategy implements MetadataStrategy {
    private logger = new Logger(GoogleBooksMetadataStrategy.name);

    async findMetadata(name: string): Promise<any> {
        this.logger.log(`#TODO Fetch Google Book API - ${name}`);

        return;
    }
}
