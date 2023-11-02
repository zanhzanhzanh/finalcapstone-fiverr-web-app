import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator";

export class CreateJobTypeDto {
    @ApiProperty({ example: 'Technology'})
    @IsNotEmpty()
    name_type: string
}