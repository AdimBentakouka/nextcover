export type ExtendedMetadata = Metadata & {cover?: ArrayBuffer};
export type BasicMetadata = Pick<
    Metadata,
    'thumbnail' | 'countPages' | 'score'
> & {
    cover?: ArrayBuffer;
    thumbnail?: string;
};

export interface GetPageParams {
    filePath: string;
    startPage: number;
    pageCount?: number;
}

export interface Chapter {
    id: string;
    title: string;
}

export interface ReaderStrategy {
    /**
     * Retrieves the content of a page or range of pages from a file at the specified path.
     *
     * @param {Object} params - An object containing the parameters for the page retrieval.
     * @param {string} params.filePath - The path to the file from which pages are to be extracted.
     * @param {number} [params.startIndex] - The optional starting index for the pages to retrieve. Defaults to the beginning if not specified.
     * @param {number} params.numberPage - The number of pages to retrieve starting from the startIndex.
     * @return {ArrayBuffer|string} An ArrayBuffer representing binary page content for non-EPUB files or a string representing textual content for EPUB files
     */
    getPage: (params: GetPageParams) => Promise<ArrayBuffer[] | string>;

    /**
     * Retrieves metadata for a specified file.
     */
    extractMetadata?: (
        filePath: string,
        thumbnail?: string,
    ) => Promise<ExtendedMetadata | BasicMetadata>;
}
