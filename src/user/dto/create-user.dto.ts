import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsEmail, IsIn, IsNotEmpty, IsPhoneNumber, MaxLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'Alice'})
    @IsNotEmpty()
    name: string

    @ApiProperty({ example: 'alice@gmail.com'})
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({ example: '1234'})
    @IsNotEmpty()
    password: string

    @ApiProperty({ example: '0123456789'})
    @IsNotEmpty()
    @IsPhoneNumber('VN')
    @MaxLength(10)
    phone: string

    @ApiProperty({ type : String, example: '2013-07-12' })
    @IsNotEmpty()
    @IsDateString()
    birthday: Date | string

    @ApiProperty({ example: 'Male'})
    @IsNotEmpty()
    @IsIn(['Male', 'Female'])
    gender: string

    @ApiProperty({ example: 'Hacker National'})
    @IsNotEmpty()
    skill: string

    @ApiProperty({ example: 'CCNA'})
    @IsNotEmpty()
    certification: string
}
