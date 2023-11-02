import { ApiProperty } from "@nestjs/swagger"
import { Prisma } from "@prisma/client"
import { IsNotEmpty, IsNumber, IsUUID, Max, Min } from "class-validator"
import { UUID } from "crypto"
import { uuidToBuffer } from "src/common/convert.common";
import { v4 as uuidv4 } from 'uuid';

export class CreateCommentDto {
    @ApiProperty({ example: 'This is wonderful comment'})
    @IsNotEmpty()
    content: string

    @ApiProperty({ example: 2 })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(5)
    comment_rate: number

    @ApiProperty({ example: '46115eda-782d-11ee-89b2-d85ed35955d9'})
    @IsNotEmpty()
    @IsUUID()
    job_id: UUID

    @ApiProperty({ example: '46100419-782d-11ee-89b2-d85ed35955d9'})
    @IsNotEmpty()
    @IsUUID()
    user_id: UUID

    public static getCreateObject(data: CreateCommentDto): Prisma.commentCreateInput { 
        return {
            id: uuidToBuffer(uuidv4()),
            date_comment: new Date(),
            content: data.content,
            comment_rate: data.comment_rate,
            job: {
                connect: { id : uuidToBuffer(data.job_id) } 
            },
            user: {
                connect: { id: uuidToBuffer(data.user_id) }
            }
        }
    }
}
