import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import {Token, TokenTypes} from './entities/token.entity';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {messages} from '../utils/messages';

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
    async create(type: TokenTypes, userId: string): Promise<Token> {
        const token = this.tokenRepository.create({type, userId});

        return await this.tokenRepository.save(token);
    }

    /**
     * Validates if a token is valid based on its ID and type, ensuring it has not expired.
     * If the token is valid, its last usage timestamp is updated.
     *
     * @param {string} tokenId - The unique identifier of the token to validate.
     * @param {TokenTypes} type - The type of the token to validate.
     * @return {Promise<string>} A promise resolving to userId if the token is valid, otherwise false.
     */
    async isValid(tokenId: string, type: TokenTypes): Promise<string> {
        const token = await this.tokenRepository.findOne({
            where: {
                id: tokenId,
                type,
            },
        });

        if (!token) {
            throw new NotFoundException(
                messages.errors.token.notFound(tokenId),
            );
        }

        if (token.expiresAt < new Date()) {
            throw new UnauthorizedException(messages.errors.token.tokenExpired);
        }

        return token.userId;
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

    /**
     * Revokes a specific token associated with a given user. Deletes the token if it exists.
     *
     * @param {string} tokenId - The unique identifier of the token to be revoked.
     * @param {string} userId - The unique identifier of the user associated with the token.
     * @return {Promise<void>} A promise that resolves when the token has been successfully revoked.
     */
    async revoke(tokenId: string, userId: string): Promise<void> {
        const token = await this.tokenRepository.findOne({
            where: {
                id: tokenId,
                userId,
            },
        });

        console.log(token, userId);

        if (!token) {
            throw new NotFoundException(
                messages.errors.token.notFound(tokenId),
            );
        }

        await this.tokenRepository.delete(tokenId);
    }
}
