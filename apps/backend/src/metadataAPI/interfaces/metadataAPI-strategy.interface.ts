import {IdentifierTypes} from '../metadataAPI.service';

export interface MetadataStrategy {
    /**
     * Getting book metadata by name
     * @param name book name
     */
    findMetadata(name: string): Promise<Metadata>;

    /**
     * Searches for metadata objects based on the provided identifier and query string.
     *
     * @param {IdentifierTypes} identifier - The identifier used to scope or categorize the search.
     * @param {string} query - The search string to find relevant metadata.
     * @return {Promise<Metadata[]>} A promise that resolves to an array of metadata objects matching the search criteria.
     */
    search(identifier: IdentifierTypes, query: string): Promise<Metadata[]>;
}
