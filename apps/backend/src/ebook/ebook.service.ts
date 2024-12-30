import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Ebook} from './entities/ebook.entity';
import {LibrariesService} from '../libraries/libraries.service';
import {MetadataService} from '../metadata/metadata.service';

@Injectable()
export class EbookService {
    private readonly logger = new Logger(EbookService.name, {
        timestamp: true,
    });

    constructor(
        @InjectRepository(Ebook)
        private readonly EbookRepository: Repository<Ebook>,
        private readonly librariesService: LibrariesService,
        private readonly metadataService: MetadataService,
    ) {}

    create(filepaths: string[]) {}

    createBulk(filepaths: string[]) {}

    findAll() {}

    findOne(filepath: string) {}

    update(filepath: string) {}

    remove(filepath: string) {}

    removeBulk(filepaths: string[]) {}
}
