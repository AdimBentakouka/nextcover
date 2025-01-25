import {Controller, Delete, Get, Patch, Request} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOperation,
    ApiResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {UsersService} from './users.service';

@ApiBearerAuth('authorization')
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get('/')
    getAllUsers() {
        return {};
    }

    @Get('me')
    @ApiOperation({summary: 'Get my user data'})
    @ApiResponse({
        description: 'The record has been successfully retrieved',
        example: {},
    })
    @ApiUnauthorizedResponse({
        description: 'You need to be logged in',
        example: {},
    })
    @ApiNotFoundResponse({
        description: 'User not found',
        example: {},
    })
    async getMyUser(@Request() req: any) {
        return await this.userService.findOneById(req.user.id);
    }

    @Get(':id')
    getUser() {
        return {};
    }

    @Patch(':id')
    updateUser() {
        return {};
    }

    @Delete(':id')
    deleteUser() {
        return {};
    }
}
