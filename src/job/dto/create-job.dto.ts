import { ApiProperty } from "@nestjs/swagger"
import { Prisma } from "@prisma/client"
import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsUUID, Min } from "class-validator"
import { UUID } from "crypto"
import { uuidToBuffer } from "src/common/convert.common"
import { v4 as uuidv4 } from 'uuid'

export class CreateJobDto {
    @ApiProperty({ example: 'Build API for Ecommerce Website'})
    @IsNotEmpty()
    job_name: string

    @ApiProperty({ example: 30000 })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    price: number

    @ApiProperty({ example: 'description'})
    @IsNotEmpty()
    desc: string

    @ApiProperty({ example: 'short description'})
    @IsNotEmpty()
    short_desc: string

    @ApiProperty({ example: '46115eda-782d-11ee-89b2-d85ed35955d9'})
    @IsNotEmpty()
    @IsUUID()
    user_id: UUID
    
    @ApiProperty({ example: '46100419-782d-11ee-89b2-d85ed35955d9'})
    @IsNotEmpty()
    @IsUUID()
    jtd_id: UUID

    @ApiProperty({ type: 'string', format: 'binary', required: true })
    file: Express.Multer.File

    public static getCreateObject(data: CreateJobDto, imagePath: string): Prisma.jobCreateInput { 
        return {
            id: uuidToBuffer(uuidv4()),
            job_name: data.job_name,
            rate_amount: 0,
            price: +data.price,
            image: imagePath,
            desc: data.desc,
            short_desc: data.short_desc,
            job_rate: 5,
            user: {
                connect: { id: uuidToBuffer(data.user_id) }
            },
            job_type_details: {
                connect: { id : uuidToBuffer(data.jtd_id) } 
            },
        }
    }
}
