import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'admin@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'Admin@123' })
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
