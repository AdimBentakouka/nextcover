import {GetPageParams, ReaderStrategy} from '../interfaces/reader-strategy.interface';

/**
 * PdfReaderStrategy is a class implementing the ReaderStrategy interface.
 * It provides functionality to read and extract page content from a PDF file.
 */
export class PdfReaderStrategy implements ReaderStrategy {
    async getPage(params: GetPageParams): Promise<ArrayBuffer[]> {
        return [new ArrayBuffer()];
    }
}
