import {Body, Controller, Post, Request, UseGuards} from '@nestjs/common';
import {CreateUserDto} from '../users/dto/create-user.dto';
import {AuthService} from './auth.service';
import {LocalAuthGuard} from './guards/local-auth.guard';
import {LoginDto} from './dto/login.dto';
import {IsPublic} from './decorators/is-public.decorator';
import {
    ApiBearerAuth,
    ApiConflictResponse,
    ApiNotFoundResponse,
    ApiOperation,
    ApiResponse,
    ApiUnauthorizedResponse,
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
    @ApiOperation({summary: 'Log in to your account'})
    @ApiResponse({
        description: 'Login successfully',
        example: AuthExample.login,
    })
    @ApiUnauthorizedResponse({
        description: 'Login failed',
        content: {
            'application/json': {
                examples: {
                    approvalRequired: {
                        summary: 'Approval required',
                        value: AuthExample.loginFailed.approvalRequired,
                    },
                    wrongCredentials: {
                        summary: 'Wrong credentials',
                        value: AuthExample.loginFailed.wrongCredentials,
                    },
                },
            },
        },
    })
    async login(@Body() _: LoginDto, @Request() req: any) {
        const {id: userId, ...rest} = req.user;

        return this.authService.login({
            userId,
            ...rest,
        });
    }

    @IsPublic()
    @ApiOperation({summary: 'Get new access token'})
    @Post('refresh-token')
    @ApiResponse({
        description: 'Refresh token successfully',
        example: AuthExample.refreshToken,
    })
    @ApiNotFoundResponse({
        description: 'Refresh token not found',
        example: AuthExample.refreshTokenNotFound,
    })
    @ApiUnauthorizedResponse({
        description: 'Refresh token expired',
        example: AuthExample.refreshTokenExpired,
    })
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto);
    }

    @ApiBearerAuth('authorization')
    @ApiOperation({summary: 'Revoke my refresh token'})
    @Post('revoke-token')
    @ApiResponse({
        description: 'Refresh token has been successfully revoked',
        example: AuthExample.refreshTokenRevoked,
    })
    @ApiNotFoundResponse({
        description: 'Refresh token not found',
        example: AuthExample.refreshTokenNotFound,
    })
    @ApiUnauthorizedResponse({
        description: 'Login required',
        example: AuthExample.loginRequired,
    })
    async revokeToken(
        @Body() refreshTokenDto: RefreshTokenDto,
        @Request() req: any,
    ) {
        const {userId} = req.user;

        return this.authService.revokeRefreshToken({
            userId,
            refreshToken: refreshTokenDto.refreshToken,
        });
    }
}
