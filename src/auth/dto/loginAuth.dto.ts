import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty } from "class-validator"

export class LoginAuthDto {
    @ApiProperty({ example: 'user1@example.com'})
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({ example: 'password1'})
    @IsNotEmpty()
    password: string
}
