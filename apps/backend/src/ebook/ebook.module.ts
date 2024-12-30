import {Module} from '@nestjs/common';
import {EbookService} from './ebook.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Ebook} from './entities/ebook.entity';
import {LibrariesModule} from '../libraries/libraries.module';
import {MetadataModule} from '../metadata/metadata.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Ebook]),
        LibrariesModule,
        MetadataModule,
    ],
    controllers: [],
    providers: [EbookService],
    exports: [EbookService],
})
export class EbookModule {}
