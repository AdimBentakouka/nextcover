import {ApiProperty} from '@nestjs/swagger';
import {IsDefined, IsEmail, IsString} from 'class-validator';

export class LoginDto {
    @ApiProperty({
        description: 'Email',
        example: 'my@e-mail.com',
    })
    @IsEmail()
    @IsDefined()
    email: string;

    @ApiProperty({
        description: 'Password',
        example: 'MyIncredibleP4ssw0rd1:p',
    })
    @IsString()
    @IsDefined()
    password: string;
}
