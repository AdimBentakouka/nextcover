import { ApiProperty } from '@nestjs/swagger';
import { LibraryType } from '../entities/library.entity';
import { IsDefined, IsEnum, IsString, Length } from 'class-validator';

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
        enum: LibraryType,
        example: LibraryType.BOOK,
    })
    @IsDefined()
    @IsEnum(LibraryType)
    type: LibraryType;
}
