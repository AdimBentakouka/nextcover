import { Module } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { GoogleBooksMetadataStrategy } from './strategies/google-books-metadata.strategy';
import { NextCoverMetadataStrategy } from './strategies/nextcover-metadata.strategy';

@Module({
    providers: [
        MetadataService,
        GoogleBooksMetadataStrategy,
        NextCoverMetadataStrategy,
    ],
})
export class MetadataModule {}
