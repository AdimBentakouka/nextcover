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
import {ApiBearerAuth} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @IsPublic()
    @Post('signup')
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
}
