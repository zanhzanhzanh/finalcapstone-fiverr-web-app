import { ApiProperty } from "@nestjs/swagger"
import { Prisma } from "@prisma/client"
import { IsNotEmpty, IsUUID } from "class-validator"
import { UUID } from "crypto"
import { uuidToBuffer } from "src/common/convert.common"
import { v4 as uuidv4 } from 'uuid'

export class CreateJobTypeDetailDto {
    @ApiProperty({ example: 'Backend Jobs'})
    @IsNotEmpty()
    name_detail: string

    @ApiProperty({ example: '46115eda-782d-11ee-89b2-d85ed35955d9'})
    @IsNotEmpty()
    @IsUUID()
    jt_id: UUID

    @ApiProperty({ type: 'string', format: 'binary', required: true })
    file: Express.Multer.File

    public static getCreateObject(data: CreateJobTypeDetailDto, imagePath: string): Prisma.job_type_detailsCreateInput { 
        return {
            id: uuidToBuffer(uuidv4()),
            name_detail: data.name_detail,
            image: imagePath,
            job_type: {
                connect: { id : uuidToBuffer(data.jt_id) } 
            }
        }
    }
}
