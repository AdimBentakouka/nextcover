import {ApiProperty} from '@nestjs/swagger';
import {IsDefined, IsEmail, IsString} from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        description: 'Username',
        example: 'John Doe',
    })
    @IsString()
    @IsDefined()
    username: string;

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
    password: string;
}
