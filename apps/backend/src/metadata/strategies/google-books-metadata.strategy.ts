import {Injectable, Logger} from '@nestjs/common';
import {
    FindMetadata,
    MetadataStrategy,
} from '../interfaces/metadata-strategy.interface';
import {distance} from 'fastest-levenshtein';

@Injectable()
export class GoogleBooksMetadataStrategy implements MetadataStrategy {
    private readonly logger = new Logger(GoogleBooksMetadataStrategy.name);
    private readonly apiUrl = 'https://www.googleapis.com/books/v1/volumes';

    private readonly maxResults = '5';

    private readonly distanceThreshold = 5;

    async findMetadata(name: string): Promise<FindMetadata> {
        this.logger.log(
            `Fetching book metadata from Google Book API for '${name}'`,
        );

        const bookApiUrl = this.prepareApiUrl(name);

        const response = await fetch(bookApiUrl);
        if (!response.ok) {
            return null;
        }

        const data = (await response.json()) as GoogleBooksApiResponse;
        if (!data || data.totalItems === 0) {
            this.logger.warn(`${name} not found`);
            return;
        }

        const volumeInfo = data.items.map(
            ({
                volumeInfo: {
                    title,
                    authors,
                    categories,
                    imageLinks,
                    industryIdentifiers,
                    publishedDate,
                    seriesInfo,
                    ...rest
                },
            }) => ({
                title,
                authors: authors?.toString(),
                tags: categories?.toString(),
                thumbnail: imageLinks?.smallThumbnail,
                isbn: industryIdentifiers?.find(({type}) => type === 'ISBN_13')
                    ?.identifier,
                publishedDate: new Date(publishedDate),
                distance: this.getScore(
                    name,
                    title,
                    seriesInfo?.bookDisplayNumber,
                ),
                ...rest,
            }),
        );

        const selectedVolume = volumeInfo
            .filter((a) => a.distance <= this.distanceThreshold)
            .sort((a, b) => a.distance - b.distance)[0];

        if (!selectedVolume) {
            this.logger.warn(`${name} not found`);
            return;
        }

        this.logger.log(`${name} is mapped to ${selectedVolume.title}`);

        return selectedVolume;
    }

    /**
     * Prepares a complete API URL with the provided query parameters.
     *
     * @param {string} name - The name of book to be used as a query parameter in the API URL.
     * @return {string} The fully constructed API URL including the query parameters.
     */
    private prepareApiUrl(name: string): string {
        const url = new URL(this.apiUrl);
        url.searchParams.append('q', name);
        url.searchParams.append('maxResults', this.maxResults);

        return url.toString();
    }

    private getScore = (
        titleA: string,
        titleB: string,
        bookDisplayNumber: string,
    ) => {
        if (
            bookDisplayNumber &&
            bookDisplayNumber === titleA.match(/(\d+)/)[1]
        ) {
            return 0;
        }

        return distance(titleA, titleB);
    };
}
