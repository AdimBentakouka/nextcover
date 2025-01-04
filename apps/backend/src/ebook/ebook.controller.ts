import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiConsumes,
    ApiNotFoundResponse,
    ApiOperation,
    ApiParam,
    ApiResponse,
} from '@nestjs/swagger';
import {EbookService} from './ebook.service';
import {ebookExample} from '../examples/ebook-example';
import {UpdateEbookDto} from './dto/update-ebook.dto';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {randomUUID} from 'node:crypto';
import {getExtension} from '../utils/file-utils';

@Controller('ebook')
export class EbookController {
    constructor(private readonly ebookService: EbookService) {}

    @Get(':id')
    @ApiOperation({summary: 'Get a ebook by id'})
    @ApiParam({
        name: 'id',
        description: 'The ebook id',
        example: '16e32433-e75c-40a1-9819-83b4af4bb954',
    })
    @ApiResponse({
        description: 'The record has been successfully retrieved.',
        example: ebookExample.findOne,
    })
    @ApiNotFoundResponse({
        description: "Ebook doesn't exist",
        example: ebookExample.notFound,
    })
    findOne(@Param('id') id: string) {
        return this.ebookService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({summary: 'Update manually metadata of ebook'})
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileInterceptor('cover', {
            storage: diskStorage({
                destination: './uploads/covers/',
                filename: (req, file, callback) => {
                    const nameFile = randomUUID();
                    const fileExtName = getExtension(file.originalname);
                    callback(null, `${nameFile}${fileExtName}`);
                },
            }),
            fileFilter: (req, file, callback) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
                    return callback(
                        new BadRequestException(
                            'Only image files are allowed!',
                        ),
                        false,
                    );
                }
                callback(null, true);
            },
        }),
    )
    @ApiResponse({
        description: 'The record has been successfully updated.',
        example: ebookExample.findOne,
    })
    @ApiNotFoundResponse({
        description: "Ebook doesn't exist",
        example: ebookExample.notFound,
    })
    async update(
        @Param('id') id: string,
        @Body() updateEbookDto: UpdateEbookDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return await this.ebookService.update(id, updateEbookDto, file);
    }

    @Delete(':id')
    @ApiOperation({summary: 'Delete a ebook'})
    @ApiParam({
        name: 'id',
        description: 'The ebook id',
        example: '16e32433-e75c-40a1-9819-83b4af4bb954',
    })
    @ApiNotFoundResponse({
        description: "Ebook doesn't exist",
        example: ebookExample.notFound,
    })
    @ApiResponse({
        description: 'The record has been successfully deleted.',
        example: ebookExample.delete,
    })
    remove(@Param('id') id: string) {
        return this.ebookService.removeEbook(id);
    }

    refreshMetadata() {}

    refreshMetadataByISBN() {}

    getPage() {}
}
