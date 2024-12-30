import { Injectable, Logger } from '@nestjs/common';
import { MetadataStrategy } from '../interfaces/metadata-strategy.interface';

@Injectable()
export class CustomMetadataStrategy implements MetadataStrategy {
    private logger = new Logger(CustomMetadataStrategy.name);

    async findMetadata(name: string): Promise<any> {
        this.logger.log(`#TODO Custom Strategy metadata - ${name}`);

        return;
    }
}
