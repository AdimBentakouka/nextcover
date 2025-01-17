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
        infoLink?: string;
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
