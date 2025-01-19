import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UsersService} from '../users/users.service';
import {CreateUserDto} from '../users/dto/create-user.dto';
import {User} from '../users/entities/user.entity';
import bcrypt from 'bcryptjs';
import {JwtService} from '@nestjs/jwt';
import {TokensService} from '../tokens/tokens.service';
import {TokenTypes} from '../tokens/entities/token.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private jwtService: JwtService,
        private readonly tokensService: TokensService,
    ) {}

    /**
     * Registers a new user in the system.
     *
     * @param {CreateUserDto} createUserDto - Data transfer object containing the user's registration details.
     * @return {Promise<User>} Promise that resolves to the created user object.
     */
    async signUp(createUserDto: CreateUserDto): Promise<User> {
        if (
            !(await this.tokensService.isValid(
                createUserDto.tokenId,
                TokenTypes.SIGN_UP,
            ))
        ) {
            throw new UnauthorizedException();
        }
        const user = await this.userService.create(createUserDto);

        await this.tokensService.delete(
            createUserDto.tokenId,
            TokenTypes.SIGN_UP,
        );

        return user;
    }

    /**
     * Validates a user's credentials by checking the provided email and password
     * against stored user data.
     *
     * @param {string} email - The email of the user to validate.
     * @param {string} password - The password of the user to validate.
     * @return {Promise<Omit<User, 'password'> | null>} A promise that resolves to the user object without the password field if validation is successful, or null if validation fails.
     */
    async validateUser(
        email: string,
        password: string,
    ): Promise<Omit<User, 'password'> | null> {
        const user = await this.userService.findOneByEmail(email);

        if (user && bcrypt.compareSync(password, user.password)) {
            const {password, ...rest} = user;
            return {...rest};
        }
        return null;
    }

    /**
     * Authenticates a user and generates an access token.
     *
     * @param {Object} params - The parameters for login.
     * @param {string} params.id - The unique identifier of the user.
     * @param {boolean} [params.isOwner] - Indicates if the user is an owner. Optional.
     * @return {Promise<Object>} Returns a promise that resolves to an object containing the access token.
     */
    async login({
        id,
        isOwner,
    }: {
        id: string;
        isOwner?: boolean;
    }): Promise<{access_token: string}> {
        const payload = {
            sub: id,
            isOwner,
        };

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    /**
     * Sends an invitation to a user by creating a sign-up token and preparing for email delivery.
     *
     * @param {string} _email - The email address of the user to invite.
     * @return {Promise<Object>} A promise that resolves to an object containing the token ID and its expiration date.
     */
    async inviteUser(
        _email: string,
    ): Promise<{token: string; expiresAt: Date}> {
        const token = await this.tokensService.create(TokenTypes.SIGN_UP);

        //Todo Send Mail

        return {token: token.id, expiresAt: token.expiresAt};
    }
}
