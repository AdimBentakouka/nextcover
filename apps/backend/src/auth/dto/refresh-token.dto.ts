import {ApiProperty} from '@nestjs/swagger';
import {IsDefined, IsString, Length} from 'class-validator';

export class RefreshTokenDto {
    @ApiProperty({
        description: 'refresh token',
        example: '0e7bacd7-b074-439c-9ca7-aa34f7deffe6',
    })
    @IsDefined()
    @IsString()
    @Length(1)
    refreshToken: string;
}
