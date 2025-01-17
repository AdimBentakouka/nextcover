import {ApiProperty} from '@nestjs/swagger';
import {IsDefined, IsEnum, IsString} from 'class-validator';
import {IdentifierTypes, MetadataStrategies} from '../metadataAPI.service';

export class SearchDto {
    @ApiProperty({
        description: 'Search by Title or ISBN',
        example: 'ISBN',
    })
    @IsDefined()
    @IsEnum(IdentifierTypes)
    identifier: IdentifierTypes;

    @ApiProperty({
        description: 'strategies metadataAPI to use',
        example: 'Google Books API',
    })
    @IsDefined()
    @IsEnum(MetadataStrategies)
    metadataStrategy: MetadataStrategies;

    @ApiProperty({
        description: 'query to search',
        example: 'Harry Potter',
    })
    @IsDefined()
    @IsString()
    query: string;
}
