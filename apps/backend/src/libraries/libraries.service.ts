import {ConflictException, Injectable, Logger, NotFoundException} from '@nestjs/common';
import {CreateLibraryDto} from './dto/create-library.dto';
import {UpdateLibraryDto} from './dto/update-library.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Library} from './entities/library.entity';
import {EventEmitter2} from '@nestjs/event-emitter';
import {checkPathExists, ensurePathEndWithSlash} from '../utils/file-utils';

import {AppEvents} from '../utils/event-constants';
import {messages} from '../utils/messages';

/**
 * A service responsible for managing library-related operations, such as creating, retrieving, updating, and deleting library entities.
 * Emits events "libraries.updated" upon library updates.
 */
@Injectable()
export class LibrariesService {
    private readonly logger = new Logger(LibrariesService.name, {
        timestamp: true,
    });

    constructor(
        @InjectRepository(Library)
        private readonly libraryRepository: Repository<Library>,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    /**
     * Creates a new library record in the repository.
     * Emits an event **AppEvents.LIBRARIES_UPDATED** upon successful creation.
     * @param {CreateLibraryDto} createLibraryDto - The data transfer object containing the necessary information to create a library.
     * @return {Promise<Object>} A promise that resolves with the newly created library record.
     */
    async create(createLibraryDto: CreateLibraryDto): Promise<Library> {
        try {
            createLibraryDto.path = ensurePathEndWithSlash(
                createLibraryDto.path,
            );

            await this.handlePathNotExist(createLibraryDto.path);

            const library = this.libraryRepository.create(createLibraryDto);

            const createResult = await this.libraryRepository.save(library);

            this.eventEmitter.emit(AppEvents.LIBRARIES_UPDATED);

            this.logger.log(
                messages.success.library.created(
                    createResult.name,
                    createResult.path,
                ),
            );

            return createResult;
        } catch (error) {
            if (
                error.code === 'SQLITE_CONSTRAINT' &&
                error.message.includes('UNIQUE constraint failed: library.path')
            ) {
                throw new ConflictException(
                    messages.errors.path.alreadyUsed(createLibraryDto.path),
                );
            }
            this.logger.error(error);
            throw error;
        }
    }

    /**
     * Retrieves all records from the library repository.
     *
     * @return {Promise<Library[]>} An array containing all records found in the library repository.
     */
    findAll(): Promise<Library[]> {
        return this.libraryRepository.find();
    }

    /**
     * Retrieves a single library entity by id.
     * If the library is not found, throws a NotFoundException.
     *
     * @param {string} id - The unique identifier of the library to retrieve.
     * @return {Promise<Library>} Returns a promise that resolves with the library entity, including its related ebooks.
     */
    async findOne(id: string): Promise<Library> {
        const library = await this.libraryRepository.findOne({
            where: {
                id: id,
            },
            relations: ['ebooks'],
        });

        if (!library) {
            throw new NotFoundException(messages.errors.library.notFound(id));
        }

        return library;
    }

    /**
     * Updates the library by ID.
     * Emits an event "libraries.updated" upon successful updated.
     * @param {string} id - The ID of the library to update.
     * @param {UpdateLibraryDto} updateLibraryDto - The data to update the library with.
     * @return {Promise<Library>} A promise that resolves to the updated library entity.
     */
    async update(
        id: string,
        updateLibraryDto: UpdateLibraryDto,
    ): Promise<Library> {
        try {
            const library = await this.findOne(id);
            const {name, path} = library;

            await this.handlePathNotExist(updateLibraryDto.path);

            const newLibrary = this.libraryRepository.merge(
                library,
                updateLibraryDto,
            );

            const updateResult = await this.libraryRepository.save(newLibrary);

            if (updateLibraryDto.path !== path) {
                this.eventEmitter.emit(AppEvents.LIBRARIES_UPDATED);
            }

            this.logger.log(messages.success.library.updated(name));

            return updateResult;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**
     * Removes a library record by id.
     * Emits an event "libraries.updated" upon successful deleted.
     * @param {string} id - The unique identifier of the library to be removed.
     * @return {Promise<Object>} A promise that resolves with a message indicating the library has been deleted,
     * or throws an error if the library is not found.
     * @throws {NotFoundException} If the library with the given id is not found.
     */
    async remove(id: string): Promise<{message: string}> {
        try {
            const deleteResult = await this.libraryRepository.delete(id);

            if (deleteResult.affected) {
                const deletionMessage = messages.success.library.deleted(id);

                this.logger.log(deletionMessage);
                this.eventEmitter.emit(AppEvents.LIBRARIES_UPDATED);

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

    /**
     * Handles scenarios when the specified path does not exist.
     *
     * @param {string} path - The path to check for existence.
     * @return {Promise<void>} A promise that resolves when the operation is complete.
     * @throws {ConflictException} If the path already exists.
     */
    private async handlePathNotExist(path: string): Promise<void> {
        if (!checkPathExists(path)) {
            throw new ConflictException(messages.errors.path.notExist(path));
        }
    }
}
