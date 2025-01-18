import {Injectable, Logger, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import bcrypt from 'bcryptjs';
import {User} from './entities/user.entity';
import {messages} from '../utils/messages';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name, {
        timestamp: true,
    });

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    /**
     * Retrieves all user records from the repository.
     *
     * @return {Promise<User[]>} A promise that resolves to an array of User objects.
     */
    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    /**
     * Finds a user by their email address.
     *
     * @param {string} email - The email address of the user to be searched.
     * @return {Promise<User>} Returns a promise that resolves to the user object if found, or undefined.
     * @throws {NotFoundException} Throws an exception if the user is not found.
     */
    async findOneByEmail(email: string): Promise<User | undefined> {
        return await this.userRepository.findOne({
            select: [
                'id',
                'username',
                'email',
                'avatar',
                'isOwner',
                'password',
            ],
            where: {
                email: email,
            },
        });
    }

    /**
     * Retrieves a user based on the provided ID.
     *
     * @param {string} id - The ID of the user to retrieve.
     * @return {Promise<User>} The user corresponding to the given ID, or undefined if not found.
     */
    async findOneById(id: string): Promise<User> {
        const user = await this.userRepository.findOneBy({id});

        if (!user) {
            throw new NotFoundException(messages.errors.user.notFound(id));
        }

        return user;
    }

    /**
     * Creates a new user and saves it to the repository.
     *
     * @param {CreateUserDto} createUserDto - The data transfer object containing user details for creation.
     * @return {Promise<User>} A promise that resolves to the newly created user entity.
     */
    async create(createUserDto: CreateUserDto): Promise<User> {
        const ownerUser = await this.userRepository.findOneBy({isOwner: true});

        const user = await this.userRepository.save({
            ...createUserDto,
            password: await bcrypt.hash(createUserDto.password, 10),
            isOwner: !ownerUser,
        });

        this.logger.log(messages.success.user.created(user.email));

        return user;
    }

    /**
     * Updates a user entity with the given data.
     *
     * @param {string} id - The unique identifier of the user to update.
     * @param {UpdateUserDto} updateUserDto - The data transfer object containing updated properties for the user.
     * @return {Promise<User>} A promise that resolves to the updated user entity.
     */
    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.findOneById(id);

        const newUser = this.userRepository.merge(user, updateUserDto);

        const updatedUser = await this.userRepository.save(newUser);

        this.logger.log(messages.success.user.updated(user.email));

        return updatedUser;
    }

    /**
     * Removes a user by the given identifier.
     *
     * @param {string} id - The unique identifier of the user to be removed.
     * @return {Promise<{message: string}>} A promise resolving to an object containing a success message upon successful deletion.
     */
    async remove(id: string): Promise<{message: string}> {
        try {
            const deleteResult = await this.userRepository.delete(id);

            if (deleteResult.affected) {
                const deletionMessage = messages.success.user.deleted(id);

                this.logger.log(deletionMessage);

                return {
                    message: deletionMessage,
                };
            }

            throw new NotFoundException(messages.errors.library.notFound(id));
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
