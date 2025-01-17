import {Module} from '@nestjs/common';
import {MetadataAPIService} from './metadataAPI.service';
import {GoogleBooksMetadataAPIStrategy} from './strategies/google-books-metadataAPI.strategy';
import {CustomMetadataAPIStrategy} from './strategies/custom-metadataAPI.strategy';
import {MetadataAPIController} from './metadataAPI.controller';

@Module({
    providers: [
        MetadataAPIService,
        GoogleBooksMetadataAPIStrategy,
        CustomMetadataAPIStrategy,
    ],
    controllers: [MetadataAPIController],
    exports: [MetadataAPIService],
})
export class MetadataAPIModule {}
