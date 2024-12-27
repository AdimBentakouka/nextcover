import {
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Library } from './entities/library.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

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

    async create(createLibraryDto: CreateLibraryDto) {
        try {
            const library = this.libraryRepository.create(createLibraryDto);

            const result = await this.libraryRepository.save(library);

            this.eventEmitter.emit('watch-folder.update');

            this.logger.log(
                `Library '${result.name}' created at '${result.path}'`,
            );

            return result;
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT') {
                throw new ConflictException('Path already used');
            }
        }
    }

    findAll() {
        return this.libraryRepository.find();
    }

    async findOne(id: string) {
        const library = await this.libraryRepository.findOne({
            where: {
                id: id,
            },
        });

        if (!library) {
            throw new NotFoundException(`Library with id '${id}' not found.`);
        }

        return library;
    }

    async update(id: string, updateLibraryDto: UpdateLibraryDto) {
        try {
            const library = await this.findOne(id);

            const newLibrary = this.libraryRepository.merge(
                library,
                updateLibraryDto,
            );

            const result = await this.libraryRepository.save(newLibrary);

            this.logger.log(`Library '${library.name}' updated.`);

            this.eventEmitter.emit('watch-folder.update');

            return result;
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT') {
                throw new ConflictException('Path already used');
            }
            throw error;
        }
    }

    async remove(id: string) {
        const result = await this.libraryRepository.delete(id);

        this.logger.log(`Library '${id}' deleted.`);

        if (result.affected) {
            this.eventEmitter.emit('watch-folder.update');

            return {
                message: 'Library has been deleted.',
            };
        }

        throw new NotFoundException(`Library with id '${id}' not found.`);
    }
}
