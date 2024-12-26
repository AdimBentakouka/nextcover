import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibrariesModule } from './libraries/libraries.module';
import { WatchFolderModule } from './watch-folder/watch-folder.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

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
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
