import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateJobTypeDetailDto } from './create-job-type-detail.dto';
import { Prisma } from '@prisma/client';

export class UpdateJobTypeDetailDto extends PartialType(
    OmitType(CreateJobTypeDetailDto, ['jt_id'] as const),
) {
    public static getUpdateObject(data: UpdateJobTypeDetailDto, imagePath: string): Prisma.job_type_detailsUpdateInput {
        // Take Image Path instead of File Multer
        delete data.file;
        if (imagePath !== null) return { image: imagePath, ...data } 
        return { ...data };
    }
}
