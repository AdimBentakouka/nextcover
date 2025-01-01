import {Module} from '@nestjs/common';
import {MetadataAPIService} from './metadataAPI.service';
import {GoogleBooksMetadataAPIStrategy} from './strategies/google-books-metadataAPI.strategy';
import {CustomMetadataAPIStrategy} from './strategies/custom-metadataAPI.strategy';

@Module({
    providers: [
        MetadataAPIService,
        GoogleBooksMetadataAPIStrategy,
        CustomMetadataAPIStrategy,
    ],
    exports: [MetadataAPIService],
})
export class MetadataAPIModule {}
