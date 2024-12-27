import { Injectable, Logger } from '@nestjs/common';
import { MetadataStrategy } from '../interfaces/metadata-strategy.interface';

@Injectable()
export class NextCoverMetadataStrategy implements MetadataStrategy {
    private logger = new Logger(NextCoverMetadataStrategy.name);

    async findMetadata(name: string): Promise<any> {
        this.logger.log(`#TODO Fetch Manually metadata - ${name}`);

        return;
    }
}
