import {Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {UsersModule} from '../users/users.module';
import {JwtModule} from '@nestjs/jwt';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {AuthService} from './auth.service';
import {JwtAuthGuard} from './guards/jwt-auth.guard';
import {APP_GUARD} from '@nestjs/core';
import {JwtStrategy} from './strategies/jwt.strategy';
import {LocalStrategy} from './strategies/local.strategy';

@Module({
    imports: [
        UsersModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                global: true,
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_EXPIRES'),
                },
            }),
        }),
    ],
    providers: [
        AuthService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard, // Définit JwtAuthGuard comme garde global
        },
        JwtAuthGuard,
        JwtStrategy,
        LocalStrategy,
    ],
    controllers: [AuthController],
    exports: [JwtModule, JwtAuthGuard],
})
export class AuthModule {}
