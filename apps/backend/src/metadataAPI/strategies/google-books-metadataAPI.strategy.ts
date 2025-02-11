import {Injectable, Logger} from '@nestjs/common';
import {MetadataStrategy} from '../interfaces/metadataAPI-strategy.interface';
import {messages} from '../../utils/messages';
import {wait} from '../../utils/wait';
import {distance} from 'fastest-levenshtein';
import {IdentifierTypes} from '../metadataAPI.service';

const MAX_RETRIES = 3;
const TOO_MANY_REQUESTS_STATUS = 429;
const TOO_MANY_REQUESTS_DELAY = 2_000;

@Injectable()
export class GoogleBooksMetadataAPIStrategy implements MetadataStrategy {
    private readonly logger = new Logger(GoogleBooksMetadataAPIStrategy.name);
    private readonly apiUrl = 'https://www.googleapis.com/books/v1/volumes';

    private readonly maxResults = '5';

    private readonly distanceThreshold = 15;

    /**
     * Searches for metadata based on the given identifier and query string.
     *
     * @param {IdentifierTypes} identifier - The type of identifier to use for the search (e.g., 'ISBN').
     * @param {string} query - The query string or search term.
     * @return {Promise<Metadata[]>} A promise that resolves to an array of metadata results.
     */
    async search(
        identifier: IdentifierTypes,
        query: string,
    ): Promise<Metadata[]> {
        const response = await this.fetchWithRetry(
            `${identifier === IdentifierTypes.ISBN ? 'isbn:' : ''}${query}`,
            TOO_MANY_REQUESTS_DELAY,
            0,
        );

        const data = (await response.json()) as GoogleBooksApiResponse;

        return data.items.map(
            ({
                volumeInfo: {
                    title,
                    description,
                    authors,
                    imageLinks,
                    categories,
                    industryIdentifiers,
                    infoLink,
                },
            }) => ({
                title: title,
                description,
                authors: authors?.toString(),
                thumbnail: imageLinks
                    ? imageLinks.smallThumbnail || imageLinks.thumbnail
                    : undefined,
                tags: categories?.toString(),
                isbn:
                    industryIdentifiers?.find(({type}) => type === 'ISBN_13')
                        ?.identifier || undefined,
                infoLink,
            }),
        );
    }

    /**
     * Fetches metadata for a given ebook title from the Google Books API.
     *
     * @param {string} ebookTitle - The title of the ebook for which metadata is being searched.
     * @return {Promise<Metadata>} A promise that resolves to the metadata of the best matching book, if found.
     */
    async findMetadata(ebookTitle: string): Promise<Metadata> {
        this.logger.log(messages.logs.googleBooksApi.fetching(ebookTitle));

        const response = await this.fetchWithRetry(
            ebookTitle,
            TOO_MANY_REQUESTS_DELAY,
            0,
        );

        const data = (await response.json()) as GoogleBooksApiResponse;

        if (data.totalItems === 0) {
            this.logger.warn(
                messages.errors.googleBooksApi.notFound(ebookTitle),
            );

            return {
                title: ebookTitle,
                score: 1_000,
            };
        }

        const metadataList: Metadata[] = data.items.map(
            (
                {
                    volumeInfo: {
                        title,
                        description,
                        authors,
                        imageLinks,
                        categories,
                        industryIdentifiers,
                        seriesInfo,
                    },
                },
                index,
            ) => ({
                title: title,
                description,
                authors: authors?.toString(),
                thumbnail: imageLinks
                    ? imageLinks.smallThumbnail || imageLinks.thumbnail
                    : undefined,
                tags: categories?.toString(),
                isbn:
                    industryIdentifiers?.find(({type}) => type === 'ISBN_13')
                        ?.identifier || undefined,
                bookDisplayNumber: +seriesInfo?.bookDisplayNumber || undefined,
                score: this.calcScore({
                    ebookTitle,
                    potentialTitle: title,
                    bookNumber: +seriesInfo?.bookDisplayNumber || undefined,
                    index,
                }),
            }),
        );

        const bestMatches = metadataList
            .filter(({score}) => score <= this.distanceThreshold)
            .sort((a, b) => a.score - b.score);

        if (bestMatches.length === 0) {
            this.logger.warn(
                messages.errors.googleBooksApi.notFound(ebookTitle),
            );

            return {
                title: ebookTitle,
                score: 1_000,
            };
        }

        this.logger.log(
            messages.success.googleBooksApi.titleMapped(
                ebookTitle,
                bestMatches[0].title,
                bestMatches[0].score,
            ),
        );

        return bestMatches[0];
    }

    /**
     * Fetches a resource from an API with retry logic in case of rate-limiting errors.
     *
     * @param {string} ebookTitle - The title of the eBook to be used in the request.
     * @param {number} delay - The delay in milliseconds before retrying after a failure.
     * @param {number} retry - The number of retries attempted so far.
     * @return {Promise<Response>} A promise that resolves to the response from the API.
     */
    private async fetchWithRetry(
        ebookTitle: string,
        delay: number,
        retry: number,
    ): Promise<Response> {
        const response = await fetch(this.prepareApiUrl(ebookTitle));

        if (!response.ok && response.status === TOO_MANY_REQUESTS_STATUS) {
            this.logger.warn(
                messages.errors.googleBooksApi.tooManyRequests(
                    ebookTitle,
                    retry + 1,
                    delay,
                ),
            );

            if (retry >= MAX_RETRIES) {
                throw new Error(
                    messages.errors.googleBooksApi.tooManyRequestsFinal(
                        ebookTitle,
                    ),
                );
            }

            await wait(delay);
            return this.fetchWithRetry(ebookTitle, delay * 2, retry + 1);
        }

        return response;
    }

    /**
     * Prepares a complete API URL with the provided query parameters.
     *
     * @param {string} query - The query to be used in the API URL.
     * @return {string} The fully constructed API URL including the query parameters.
     */
    private prepareApiUrl(query: string): string {
        const url = new URL(this.apiUrl);
        url.searchParams.append('q', query);
        url.searchParams.append('maxResults', this.maxResults);

        return url.toString();
    }

    /**
     * Cleans the provided title by removing specific punctuation marks and spaces.
     *
     * @param {string} title - The title string to be cleaned.
     * @return {string} The cleaned title with punctuation marks and spaces removed.
     */
    private cleanTitle(title: string): string {
        return title
            ?.replaceAll(/[,\/#!$%^&*;:{}=\-_`~() ]/g, '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    }

    /**
     * Calculates a score based on the similarity between the provided ebook title
     * and a potential title, as well as their associated metadata like book number
     * and index.
     *
     * @param {Object} params - The input parameters.
     * @param {string} params.ebookTitle - The title of the ebook to compare.
     * @param {string} params.potentialTitle - The potential title to compare against.
     * @param {number} params.bookNumber - The book number associated with the ebook.
     * @param {number} params.index - The index of the potential title in a list or sequence.
     * @return {number} - A score representing the similarity between the titles. Lower scores indicate higher similarity.
     */
    private calcScore({
        ebookTitle,
        potentialTitle,
        bookNumber,
        index,
    }: {
        ebookTitle: string;
        potentialTitle: string;
        bookNumber: number;
        index: number;
    }): number {
        if (!potentialTitle) return 1_000;
        const titleNumber = ebookTitle.match(/\d+/g)?.[0];

        if (index === 0 && bookNumber === +titleNumber) {
            return 5;
        }

        return distance(
            this.cleanTitle(ebookTitle),
            this.cleanTitle(potentialTitle),
        );
    }
}
