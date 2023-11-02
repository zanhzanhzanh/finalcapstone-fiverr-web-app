import { ApiProperty } from "@nestjs/swagger"
import { Prisma } from "@prisma/client"
import { IsNotEmpty, IsUUID } from "class-validator"
import { UUID } from "crypto"
import { uuidToBuffer } from "src/common/convert.common"
import { v4 as uuidv4 } from 'uuid'

export class CreateJobRentalDto {
    @ApiProperty({ example: '46115eda-782d-11ee-89b2-d85ed35955d9'})
    @IsNotEmpty()
    @IsUUID()
    job_id: UUID

    @ApiProperty({ example: '46115eda-782d-11ee-89b2-d85ed35955d9'})
    @IsNotEmpty()
    @IsUUID()
    user_id: UUID

    public static getCreateObject(data: CreateJobRentalDto): Prisma.job_rentalCreateInput { 
        return {
            id: uuidToBuffer(uuidv4()),
            date_rent: new Date(),
            is_finish: false,
            job: {
                connect: { id : uuidToBuffer(data.job_id) } 
            },
            user: {
                connect: { id: uuidToBuffer(data.user_id) }
            }
        }
    }
}
