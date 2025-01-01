import {ApiProperty} from '@nestjs/swagger';

import {IsDefined, IsEnum, IsString, Length} from 'class-validator';
import {MetadataStrategies} from '../../metadataAPI/metadataAPI.service';
import {LibraryTypes} from '../entities/library.entity';

export class CreateLibraryDto {
    @ApiProperty({
        description: 'Library name',
        example: 'My Library',
    })
    @Length(3, 45)
    @IsDefined()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Library filepath',
        example: '/home/user/library',
    })
    @Length(1)
    @IsDefined()
    @IsString()
    path: string;

    @ApiProperty({
        description: 'Library type',
        enum: LibraryTypes,
        example: LibraryTypes.BOOK,
        default: LibraryTypes.OTHER,
    })
    @IsDefined()
    @IsEnum(LibraryTypes)
    libraryType: LibraryTypes;

    @ApiProperty({
        description: 'Strategy to use to get metadata',
        enum: MetadataStrategies,
        example: MetadataStrategies.GOOGLE_BOOKS,
        default: MetadataStrategies.GOOGLE_BOOKS,
    })
    @IsDefined()
    @IsEnum(MetadataStrategies)
    metadataStrategy: MetadataStrategies;
}
