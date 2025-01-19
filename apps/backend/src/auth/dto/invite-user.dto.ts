import {ApiProperty} from '@nestjs/swagger';
import {IsDefined, IsEmail} from 'class-validator';

export class InviteUserDto {
    @ApiProperty({
        description: 'Email user to invite',
        example: 'my@e-mail.com',
    })
    @IsEmail()
    @IsDefined()
    email: string;
}
