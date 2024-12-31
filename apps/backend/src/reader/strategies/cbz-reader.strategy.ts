import {GetPageParams, ReaderStrategy} from '../interfaces/reader-strategy.interface';

/**
 * A concrete implementation of the ReaderStrategy interface for handling CBZ or ZIP (Comic Book Zip) files.
 * This strategy is responsible for extracting and reading comic book pages from CBZ or ZIP files.
 */
export class CbzReaderStrategy implements ReaderStrategy {
    async getPage(params: GetPageParams): Promise<ArrayBuffer> {
        return new ArrayBuffer();
    }
}
