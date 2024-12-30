import {Module} from '@nestjs/common';
import {WatchFolderService} from './watch-folder.service';
import {LibrariesModule} from '../libraries/libraries.module';
import {MetadataModule} from '../metadata/metadata.module';

@Module({
    imports: [LibrariesModule, MetadataModule],
    providers: [WatchFolderService],
})
export class WatchFolderModule {}
