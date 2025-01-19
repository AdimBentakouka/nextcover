import {Module} from '@nestjs/common';
import {EbooksService} from './ebooks.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Ebook} from './entities/ebook.entity';
import {LibrariesModule} from '../libraries/libraries.module';
import {MetadataAPIModule} from '../metadataAPI/metadataAPI.module';
import {ReaderModule} from '../reader/reader.module';
import {EbooksController} from './ebooks.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Ebook]),
        LibrariesModule,
        MetadataAPIModule,
        ReaderModule,
    ],
    controllers: [EbooksController],
    providers: [EbooksService],
    exports: [EbooksService],
})
export class EbooksModule {}
