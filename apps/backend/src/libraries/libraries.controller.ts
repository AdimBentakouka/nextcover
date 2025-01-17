import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import {LibrariesService} from './libraries.service';
import {CreateLibraryDto} from './dto/create-library.dto';
import {UpdateLibraryDto} from './dto/update-library.dto';
import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiNotFoundResponse,
    ApiOperation,
    ApiParam,
    ApiResponse,
} from '@nestjs/swagger';
import {libraryExample} from '../examples/library-example';

@Controller('libraries')
export class LibrariesController {
    constructor(private readonly librariesService: LibrariesService) {}

    @Post()
    @ApiOperation({summary: 'Create a new library'})
    @ApiResponse({
        description: 'The record has been successfully created.',
        example: libraryExample.create,
    })
    @ApiBadRequestResponse({
        description: 'Data validation failed.',
        example: libraryExample.validationError,
    })
    @ApiConflictResponse({
        description: 'Path already used',
        example: libraryExample.pathExist,
    })
    @ApiConflictResponse({
        description: 'Path not exist in system',
        example: libraryExample.conflictPath,
    })
    create(@Body() createLibraryDto: CreateLibraryDto) {
        return this.librariesService.create(createLibraryDto);
    }

    @Get()
    @ApiOperation({summary: 'Get all libraries'})
    @ApiResponse({
        description: 'The record has been successfully retrieved.',
        example: libraryExample.findAll,
    })
    findAll() {
        return this.librariesService.findAll();
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get a library by id',
    })
    @ApiParam({
        name: 'id',
        description: 'The library id',
        example: 'b74a71a6-9dc8-4fd2-9fb0-aeb96aab15b2',
    })
    @ApiResponse({
        description: 'The record has been successfully retrieved.',
        example: libraryExample.findOne,
    })
    @ApiNotFoundResponse({
        description: "Library doesn't exist",
        example: libraryExample.notFound,
    })
    findOne(@Param('id') id: string) {
        return this.librariesService.findOne(id);
    }

    @Patch(':id')
    @ApiParam({
        name: 'id',
        description: 'The library id',
        example: 'b74a71a6-9dc8-4fd2-9fb0-aeb96aab15b2',
    })
    @ApiOperation({summary: 'Update a library'})
    @ApiResponse({
        description: 'The record has been successfully updated.',
        example: libraryExample.update,
    })
    @ApiNotFoundResponse({
        description: "Library doesn't exist",
        example: libraryExample.notFound,
    })
    @ApiConflictResponse({
        description: 'Path already used',
        example: libraryExample.pathExist,
    })
    @ApiConflictResponse({
        description: 'Path not exist in system',
        example: libraryExample.conflictPath,
    })
    update(
        @Param('id') id: string,
        @Body() updateLibraryDto: UpdateLibraryDto,
    ) {
        return this.librariesService.update(id, updateLibraryDto);
    }

    @Delete(':id')
    @ApiOperation({summary: 'Delete a library'})
    @ApiParam({
        name: 'id',
        description: 'The library id',
        example: 'b74a71a6-9dc8-4fd2-9fb0-aeb96aab15b2',
    })
    @ApiOperation({summary: 'Update a library'})
    @ApiResponse({
        description: 'The record has been successfully deleted.',
        example: libraryExample.delete,
    })
    @ApiNotFoundResponse({
        description: "Library doesn't exist",
        example: libraryExample.notFound,
    })
    remove(@Param('id') id: string) {
        return this.librariesService.remove(id);
    }
}
