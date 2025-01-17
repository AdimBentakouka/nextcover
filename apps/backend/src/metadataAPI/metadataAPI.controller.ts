import {Controller, Get, Query} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import {SearchDto} from './dto/search.dto';
import {MetadataAPIService} from './metadataAPI.service';
import {MetadataAPIExample} from '../examples/metadataAPI-example';

@Controller('metadata-api')
export class MetadataAPIController {
    constructor(private readonly metadataAPIService: MetadataAPIService) {}

    @Get('search')
    @ApiOperation({summary: 'Search metadata API'})
    @ApiResponse({
        description: 'Search metadata API completed',
        example: MetadataAPIExample.search,
    })
    @ApiBadRequestResponse({
        description: 'Data validation failed.',
        example: MetadataAPIExample.validationError,
    })
    search(@Query() searchDto: SearchDto) {
        return this.metadataAPIService.search(searchDto);
    }
}
