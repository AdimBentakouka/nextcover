import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {LibrariesModule} from './libraries/libraries.module';
import {WatchFolderModule} from './watch-folder/watch-folder.module';
import {EventEmitterModule} from '@nestjs/event-emitter';
import {MetadataAPIModule} from './metadataAPI/metadataAPI.module';
import {EbooksModule} from './ebooks/ebooks.module';
import {ReaderModule} from './reader/reader.module';
import {AuthModule} from './auth/auth.module';
import {UsersModule} from './users/users.module';
import {TokensModule} from './tokens/tokens.module';

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
        MetadataAPIModule,
        EbooksModule,
        ReaderModule,
        AuthModule,
        UsersModule,
        TokensModule,
    ],
    providers: [],
})
export class AppModule {}
