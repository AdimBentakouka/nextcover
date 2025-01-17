import {Injectable, Logger} from '@nestjs/common';
import {MetadataStrategy} from '../interfaces/metadataAPI-strategy.interface';
import {IdentifierTypes} from '../metadataAPI.service';

@Injectable()
export class CustomMetadataAPIStrategy implements MetadataStrategy {
    private logger = new Logger(CustomMetadataAPIStrategy.name);

    async findMetadata(name: string): Promise<any> {
        this.logger.warn(`To implement find metadata for ${name}`);

        return;
    }

    async search(
        identifier: IdentifierTypes,
        query: string,
    ): Promise<Metadata[]> {
        this.logger.warn(
            `To implement search for ${identifier} with query ${query}`,
        );
        return [];
    }
}
