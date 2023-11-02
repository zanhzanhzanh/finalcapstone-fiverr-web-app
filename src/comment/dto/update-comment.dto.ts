import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';
import { Prisma } from '@prisma/client';

export class UpdateCommentDto extends PartialType(
    OmitType(CreateCommentDto, ['user_id', 'job_id'] as const),
) {
    public static getUpdateObject(data: UpdateCommentDto): Prisma.commentUpdateInput {
        return { date_comment: new Date(), ...data };
    }
}