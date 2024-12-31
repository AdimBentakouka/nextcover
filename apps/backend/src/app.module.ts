import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {LibrariesModule} from './libraries/libraries.module';
import {WatchFolderModule} from './watch-folder/watch-folder.module';
import {EventEmitterModule} from '@nestjs/event-emitter';
import {MetadataModule} from './metadata/metadata.module';
import {EbookModule} from './ebook/ebook.module';
import { ReaderModule } from './reader/reader.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: `./db/${process.env.NODE_ENV}.sqlite`,
            synchronize: true,
            autoLoadEntities: true,
        }),
        EventEmitterModule.forRoot(),
        LibrariesModule,
        WatchFolderModule,
        MetadataModule,
        EbookModule,
        ReaderModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
