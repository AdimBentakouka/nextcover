interface GoogleBooksVolume {
    id: string;
    volumeInfo: {
        title: string;
        authors?: string[];
        publisher?: string;
        publishedDate?: string;
        description?: string;
        industryIdentifiers?: {
            type: string;
            identifier: string;
        }[];
        pageCount?: number;
        categories?: string[];
        averageRating?: number;
        ratingsCount?: number;
        imageLinks?: {
            smallThumbnail: string;
            thumbnail: string;
        };
        seriesInfo?: {
            bookDisplayNumber?: string;
        };
        language?: string;
    };
    saleInfo?: {
        country?: string;
        saleability?: string;
        isEbook?: boolean;
        listPrice?: {
            amount: number;
            currencyCode: string;
        };
        retailPrice?: {
            amount: number;
            currencyCode: string;
        };
    };
}

interface GoogleBooksApiResponse {
    kind?: string;
    totalItems?: number;
    items?: GoogleBooksVolume[];
}

interface GoogleBooksQueryParams {
    q: string; // Required: Search query (e.g., "harry potter")
    startIndex?: number; // Optional: Index of the first result (default is 0)
    maxResults?: number; // Optional: Number of results to return (max: 40)
    langRestrict?: string; // Optional: Restrict by language (e.g., "en")
    printType?: 'all' | 'books' | 'magazines'; // Optional: Type of resource
    orderBy?: 'relevance' | 'newest'; // Optional: Order of results
}
