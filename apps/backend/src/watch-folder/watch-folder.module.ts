import {Module} from '@nestjs/common';
import {WatchFolderService} from './watch-folder.service';
import {LibrariesModule} from '../libraries/libraries.module';
import {EbookModule} from '../ebook/ebook.module';

@Module({
    imports: [LibrariesModule, EbookModule],
    providers: [WatchFolderService],
})
export class WatchFolderModule {}
