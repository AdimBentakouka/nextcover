export interface MetadataStrategy {
    /**
     * Getting book metadata by name
     * @param name book name
     */
    findMetadata(name: string): Promise<Metadata>;
}
