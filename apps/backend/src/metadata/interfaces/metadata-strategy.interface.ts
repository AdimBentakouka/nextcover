export type FindMetadata = {
    title: string;
    description?: string;
    authors?: string;
    publishedDate?: Date;
    thumbnail?: string;
    isbn?: string;
    tags?: string;
};

export interface MetadataStrategy {
    /**
     * Getting book metadata by name
     * @param name book name
     */
    findMetadata(name: string): Promise<FindMetadata>;
}
