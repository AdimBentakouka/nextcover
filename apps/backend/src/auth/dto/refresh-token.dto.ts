import {ApiProperty} from '@nestjs/swagger';

export class RefreshTokenDto {
    @ApiProperty({
        description: 'UserId',
        example: '',
    })
    userId: string;

    @ApiProperty({
        description: 'UserId',
        example: '',
    })
    refreshToken: string;
}
