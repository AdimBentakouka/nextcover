import {Injectable} from '@nestjs/common';
import {UsersService} from '../users/users.service';
import {CreateUserDto} from '../users/dto/create-user.dto';
import {User} from '../users/entities/user.entity';
import bcrypt from 'bcryptjs';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private jwtService: JwtService,
    ) {}

    /**
     * Registers a new user in the system.
     *
     * @param {CreateUserDto} createUserDto - Data transfer object containing the user's registration details.
     * @return {Promise<User>} Promise that resolves to the created user object.
     */
    async signUp(createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

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
}
