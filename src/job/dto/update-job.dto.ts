import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateJobDto } from './create-job.dto';
import { Prisma } from '@prisma/client';

export class UpdateJobDto extends PartialType(
    OmitType(CreateJobDto, ['user_id', 'jtd_id'] as const),
) {
    public static getUpdateObject(data: UpdateJobDto, imagePath: string): Prisma.jobUpdateInput {
        delete data.file;
        
        // Change Price to Number
        const cloneData: any = { ...data };
        if(data.price !== undefined) {
            delete cloneData.price;
            cloneData.price = +data.price
        } else delete cloneData.price

        // Take Image Path instead of File Multer
        if(imagePath !== null) return { image: imagePath, ...cloneData };
        return { ...cloneData };
    }
}