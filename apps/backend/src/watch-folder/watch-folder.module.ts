import { Module } from '@nestjs/common';
import { WatchFolderService } from './watch-folder.service';
import { LibrariesModule } from '../libraries/libraries.module';

@Module({
    imports: [LibrariesModule],
    providers: [WatchFolderService],
})
export class WatchFolderModule {}
