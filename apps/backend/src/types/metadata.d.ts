type Metadata = {
    title: string;
    description?: string;
    authors?: string;
    publishedDate?: Date;
    thumbnail?: string;
    isbn?: string;
    tags?: string;
    bookDisplayNumber?: number;
    score?: number;
    countPages?: number;
};

type ExtendedMetadata = Metadata & {cover?: ArrayBuffer};
type BasicMetadata = Pick<Metadata, 'thumbnail' | 'countPages' | 'score'> & {
    cover?: ArrayBuffer;
    thumbnail?: string;
};
