import {ApiProperty} from '@nestjs/swagger';
import {IsString} from 'class-validator';

export class UpdateEbookDto {
    @ApiProperty({
        description: 'Title of Ebook',
        example: "Harry Potter à l'école des sorciers",
        required: false,
    })
    @IsString()
    title?: string;

    @ApiProperty({
        description: 'Description of Ebook',
        example:
            'Le jour de ses onze ans, Harry Potter, un orphelin élevé par un oncle ...',
        required: false,
    })
    @IsString()
    description?: string;

    @ApiProperty({
        description: 'Authors of Ebook',
        example: 'J.K. Rowling',
        required: false,
    })
    @IsString()
    authors?: string;

    @ApiProperty({
        description: 'Tags of Ebook',
        example: 'Low fantasy',
        required: false,
    })
    @IsString()
    tags?: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'thumbnail to upload',
        required: false,
    })
    cover?: any;
}
