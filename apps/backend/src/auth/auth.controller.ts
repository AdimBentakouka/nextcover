import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import {CreateUserDto} from '../users/dto/create-user.dto';
import {AuthService} from './auth.service';
import {LocalAuthGuard} from './guards/local-auth.guard';
import {LoginDto} from './dto/login.dto';
import {IsPublic} from './decorators/is-public.decorator';
import {IsOwner} from './decorators/is-owner.decorator';
import {InviteUserDto} from './dto/invite-user.dto';
import {
    ApiBearerAuth,
    ApiConflictResponse,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import {RefreshTokenDto} from './dto/refresh-token.dto';
import {AuthExample} from '../examples/auth-example';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @IsPublic()
    @Post('signup')
    @ApiOperation({summary: 'Create a new account'})
    @ApiConflictResponse({
        description: 'Email already used',
        example: AuthExample.conflictEmail,
    })
    @ApiResponse({
        description: 'The record has been successfully created.',
        example: AuthExample.signUp,
    })
    async signUp(@Body() createUserDto: CreateUserDto) {
        return await this.authService.signUp(createUserDto);
    }

    @IsPublic()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body() _: LoginDto, @Request() req: any) {
        return this.authService.login(req.user);
    }

    @ApiBearerAuth('authorization')
    @IsOwner()
    @Get('invite-user')
    async inviteUser(@Query() query: InviteUserDto) {
        return this.authService.inviteUser(query.email);
    }

    @IsPublic()
    @Post('refresh-token')
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto);
    }
}
