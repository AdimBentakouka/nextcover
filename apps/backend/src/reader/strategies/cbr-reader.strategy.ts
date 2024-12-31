import {GetPageParams, ReaderStrategy} from '../interfaces/reader-strategy.interface';

/**
 * Represents a strategy for reading CBR or RAR (Comic Book RAR) files.
 * This strategy is responsible for extracting and reading comic book pages from CBR or RAR files.
 */

export class CbrReaderStrategy implements ReaderStrategy {
    async getPage(params: GetPageParams): Promise<ArrayBuffer> {
        return new ArrayBuffer();
    }
}
