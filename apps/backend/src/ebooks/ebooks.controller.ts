import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiConsumes,
    ApiNotFoundResponse,
    ApiOperation,
    ApiParam,
    ApiResponse,
} from '@nestjs/swagger';
import {EbooksService} from './ebooks.service';
import {ebookExample} from '../examples/ebook-example';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {randomUUID} from 'node:crypto';
import {getExtension} from '../utils/file-utils';
import {UpdateEbookDto} from './dto/update-ebook.dto';
import {Response} from 'express';
import {IsOwner} from 'src/auth/decorators/is-owner.decorator';

@ApiBearerAuth('authorization')
@Controller('ebooks')
export class EbooksController {
    constructor(private readonly ebookService: EbooksService) {}

    @IsOwner()
    @Get('unverified-metadata')
    @ApiOperation({summary: '🛡 - Get all unverified metadata ebooks'})
    @ApiResponse({
        description: 'The record has been successfully retrieved.',
        example: ebookExample.findUnverifiedMetadata,
    })
    findEbooksWithUnverifiedMetadata() {
        return this.ebookService.findEbooksWithUnverifiedMetadata();
    }

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

    @IsOwner()
    @Patch(':id')
    @ApiOperation({
        summary: '🛡 - Update manually metadata of ebook - must be logged in',
    })
    @ApiBearerAuth('authorization')
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

    @IsOwner()
    @Delete(':id')
    @ApiOperation({summary: '🛡 - Delete a ebook'})
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

    @IsOwner()
    @Patch(':id/refresh-metadata')
    @ApiOperation({summary: '🛡 - Refresh manually metadata of ebook'})
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
        description: 'The record has been successfully updated.',
        example: ebookExample.findOne,
    })
    @ApiNotFoundResponse({
        description: "Ebook doesn't exist",
        example: ebookExample.notFound,
    })
    async refreshMetadata(@Param('id') id: string) {
        return await this.ebookService.updateMetadataById(id);
    }

    @Get(':id/chapters')
    @ApiOperation({summary: 'Get chapters of ebook'})
    async getChapters(@Param('id') id: string) {
        return this.ebookService.getChapters(id);
    }

    @Get(':id/:page')
    @ApiOperation({summary: 'Get page from ebook id'})
    async getPages(
        @Param('id') id: string,
        @Param('page') page: number,
        @Res() res: Response,
    ) {
        const bufferPage = await this.ebookService.getPages(id, page);

        if (typeof bufferPage === 'string') {
            res.set({
                'Content-Type': 'text/html', // Remplacez par le type MIME correct (par exemple, image/png, image/webp, etc.)
                'Content-Length': bufferPage.length,
            });

            return res.send(bufferPage);
        }

        res.set({
            'Content-Type': 'image/jpeg', // Remplacez par le type MIME correct (par exemple, image/png, image/webp, etc.)
            'Content-Length': bufferPage.byteLength,
        });

        res.send(bufferPage);
    }
}
