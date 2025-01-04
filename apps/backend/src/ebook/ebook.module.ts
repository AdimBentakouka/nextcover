import {Module} from '@nestjs/common';
import {EbookService} from './ebook.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Ebook} from './entities/ebook.entity';
import {LibrariesModule} from '../libraries/libraries.module';
import {MetadataAPIModule} from '../metadataAPI/metadataAPI.module';
import {ReaderModule} from '../reader/reader.module';
import { EbookController } from './ebook.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Ebook]),
        LibrariesModule,
        MetadataAPIModule,
        ReaderModule,
    ],
    controllers: [EbookController],
    providers: [EbookService],
    exports: [EbookService],
})
export class EbookModule {}
