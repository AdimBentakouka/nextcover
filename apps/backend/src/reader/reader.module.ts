import {Module} from '@nestjs/common';
import {ReaderService} from './reader.service';
import {CbzReaderStrategy} from './strategies/cbz-reader.strategy';
import {PdfReaderStrategy} from './strategies/pdf-reader.strategy';
import {CbrReaderStrategy} from './strategies/cbr-reader.strategy';
import {EpubReaderStrategy} from './strategies/epub-reader.strategy';

@Module({
    providers: [
        ReaderService,
        CbzReaderStrategy,
        CbrReaderStrategy,
        PdfReaderStrategy,
        EpubReaderStrategy,
    ],
    exports: [ReaderService],
})
export class ReaderModule {}
