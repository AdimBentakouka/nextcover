import {Injectable} from '@nestjs/common';
import {Token, TokenTypes} from './entities/token.entity';
import {MoreThanOrEqual, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class TokensService {
    constructor(
        @InjectRepository(Token)
        private readonly tokenRepository: Repository<Token>,
    ) {}

    /**
     * Creates and saves a new token with the given type and optional user ID.
     *
     * @param {TokenTypes} type - The type of token to be created.
     * @param {string} [userId] - The optional ID of the user associated with the token.
     * @return {Promise<Token>} A promise that resolves to the newly created token.
     */
    async create(type: TokenTypes, userId?: string): Promise<Token> {
        const token = this.tokenRepository.create({type, userId});

        return await this.tokenRepository.save(token);
    }

    /**
     * Validates if a token is valid based on its ID and type, ensuring it has not expired.
     * If the token is valid, its last usage timestamp is updated.
     *
     * @param {string} tokenId - The unique identifier of the token to validate.
     * @param {TokenTypes} type - The type of the token to validate.
     * @param userId
     * @return {Promise<boolean>} A promise resolving to true if the token is valid, otherwise false.
     */
    async isValid(
        tokenId: string,
        type: TokenTypes,
        userId?: string,
    ): Promise<boolean> {
        const token = await this.tokenRepository.findOne({
            where: {
                id: tokenId,
                type,
                userId,
                expiresAt: MoreThanOrEqual(new Date()),
            },
        });

        if (token) {
            await this.tokenRepository.update(tokenId, {
                lastUsedAt: new Date(),
            });
        }

        return !!token;
    }

    /**
     * Revokes a token by updating its expiration time to the current date, effectively invalidating it.
     *
     * @param {string} tokenId - The unique identifier of the token to be revoked.
     * @return {Promise<void>} A promise that resolves once the token has been successfully revoked.
     */
    async revoke(tokenId: string): Promise<void> {
        await this.tokenRepository.update(tokenId, {
            expiresAt: new Date(),
        });
    }

    /**
     * Deletes a token based on the given tokenId and type.
     *
     * @param {string} tokenId - The unique identifier of the token to be deleted.
     * @param {TokenTypes} type - The type of the token to be deleted.
     * @return {Promise<void>} A promise that resolves when the token is successfully deleted.
     */
    async delete(tokenId: string, type: TokenTypes): Promise<void> {
        await this.tokenRepository.delete({
            id: tokenId,
            type,
        });
    }
}
