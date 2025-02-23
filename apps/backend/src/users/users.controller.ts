import {
    Controller,
    Delete,
    Get,
    NotFoundException,
    Patch,
    Request,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOperation,
    ApiResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {UsersService} from './users.service';
import {messages} from '../utils/messages';
import {AuthExample} from '../examples/auth-example';
import {UserExample} from '../examples/user-example';

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
        example: UserExample.me,
    })
    @ApiUnauthorizedResponse({
        description: 'You need to be logged in',
        example: AuthExample.loginRequired,
    })
    @ApiNotFoundResponse({
        description: 'User not found',
        example: UserExample.notFound,
    })
    async getMyUser(@Request() req: any) {
        const {userId} = req.user;
        if (!userId) {
            throw new NotFoundException(messages.errors.user.notFound(userId));
        }
        return await this.userService.findOneById(userId);
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
