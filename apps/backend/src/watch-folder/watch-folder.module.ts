import {Module} from '@nestjs/common';
import {WatchFolderService} from './watch-folder.service';
import {LibrariesModule} from '../libraries/libraries.module';
import {EbooksModule} from '../ebooks/ebooks.module';

@Module({
    imports: [LibrariesModule, EbooksModule],
    providers: [WatchFolderService],
})
export class WatchFolderModule {}
