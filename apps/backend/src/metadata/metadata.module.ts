import {Module} from '@nestjs/common';
import {MetadataService} from './metadata.service';
import {GoogleBooksMetadataStrategy} from './strategies/google-books-metadata.strategy';
import {CustomMetadataStrategy} from './strategies/custom-metadata.strategy';

@Module({
    providers: [
        MetadataService,
        GoogleBooksMetadataStrategy,
        CustomMetadataStrategy,
    ],
    exports: [MetadataService],
})
export class MetadataModule {}
