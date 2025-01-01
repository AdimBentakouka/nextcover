import {Injectable, Logger} from '@nestjs/common';
import {MetadataStrategy} from '../interfaces/metadataAPI-strategy.interface';

@Injectable()
export class CustomMetadataAPIStrategy implements MetadataStrategy {
    private logger = new Logger(CustomMetadataAPIStrategy.name);

    async findMetadata(name: string): Promise<any> {
        this.logger.log(`#TODO Custom Strategy metadata - ${name}`);

        return;
    }
}
