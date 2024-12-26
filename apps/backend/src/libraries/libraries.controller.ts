import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { LibrariesService } from './libraries.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('libraries')
export class LibrariesController {
    constructor(private readonly librariesService: LibrariesService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new library' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        example: {
            name: 'My Library',
            path: '/home/user/library',
            type: 'book',
            id: 'b74a71a6-9dc8-4fd2-9fb0-aeb96aab15b2',
            createdAt: '2024-12-26T12:18:59.000Z',
            updatedAt: '2024-12-26T12:18:59.000Z',
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Data validation failed.',
        example: {
            message: [
                {
                    property: 'name',
                    children: [],
                    constraints: {
                        isLength:
                            'name must be longer than or equal to 3 characters',
                    },
                },
                {
                    property: 'type',
                    children: [],
                    constraints: {
                        isEnum: 'type must be one of the following values: book, manga, manwa, other',
                    },
                },
            ],
            error: 'Bad Request',
            statusCode: 400,
        },
    })
    @ApiResponse({
        status: 409,
        description: 'Path already used',
        example: {
            message: 'Path already used',
            error: 'Conflict',
            statusCode: 409,
        },
    })
    create(@Body() createLibraryDto: CreateLibraryDto) {
        return this.librariesService.create(createLibraryDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all libraries' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully retrieved.',
        example: [
            {
                id: 'b74a71a6-9dc8-4fd2-9fb0-aeb96aab15b2',
                name: 'My Library',
                path: '/home/user/library',
                type: 'book',
                createdAt: '2024-12-26T12:18:59.000Z',
                updatedAt: '2024-12-26T12:18:59.000Z',
            },
        ],
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
        status: 200,
        description: 'The record has been successfully retrieved.',
        example: {
            id: 'b74a71a6-9dc8-4fd2-9fb0-aeb96aab15b2',
            name: 'My Library',
            path: '/home/user/library',
            type: 'book',
            createdAt: '2024-12-26T12:18:59.000Z',
            updatedAt: '2024-12-26T12:30:11.000Z',
        },
    })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully retrieved.',
        example: {
            id: 'b74a71a6-9dc8-4fd2-9fb0-aeb96aab15b2',
            name: 'My Library',
            path: '/home/user/library',
            type: 'book',
            createdAt: '2024-12-26T12:18:59.000Z',
            updatedAt: '2024-12-26T12:30:11.000Z',
        },
    })
    @ApiResponse({
        status: 404,
        description: "Library doesn't exist",
        example: {
            message:
                "Library with id '5a3eca0a-a26c-4cf3-857b-ad5063348973' not found.",
            error: 'Not Found',
            statusCode: 404,
        },
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
    @ApiOperation({ summary: 'Update a library' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        example: {
            id: '5a3eca0a-a26c-4cf3-857b-ad5063348973',
            name: 'tes',
            path: '/home/user/library',
            type: 'book',
            createdAt: '2024-12-26T13:00:24.000Z',
            updatedAt: '2024-12-26T13:08:09.000Z',
        },
    })
    @ApiResponse({
        status: 404,
        description: "Library doesn't exist",
        example: {
            message:
                "Library with id '5a3eca0a-a26c-4cf3-857b-ad5063348973' not found.",
            error: 'Not Found',
            statusCode: 404,
        },
    })
    @ApiResponse({
        status: 409,
        description: 'Path already used',
        example: {
            message: 'Path already used',
            error: 'Conflict',
            statusCode: 409,
        },
    })
    update(
        @Param('id') id: string,
        @Body() updateLibraryDto: UpdateLibraryDto,
    ) {
        return this.librariesService.update(id, updateLibraryDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a library' })
    @ApiParam({
        name: 'id',
        description: 'The library id',
        example: 'b74a71a6-9dc8-4fd2-9fb0-aeb96aab15b2',
    })
    @ApiOperation({ summary: 'Update a library' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully deleted.',
        example: {
            message: 'Library has been deleted.',
        },
    })
    @ApiResponse({
        status: 404,
        description: "Library doesn't exist",
        example: {
            message:
                "Library with id '5a3eca0a-a26c-4cf3-857b-ad5063348973' not found.",
            error: 'Not Found',
            statusCode: 404,
        },
    })
    remove(@Param('id') id: string) {
        return this.librariesService.remove(id);
    }
}
