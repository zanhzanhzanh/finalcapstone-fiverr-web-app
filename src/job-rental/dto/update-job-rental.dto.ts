import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateJobRentalDto } from './create-job-rental.dto';
import { Prisma } from '@prisma/client';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateJobRentalDto extends PartialType(
    OmitType(CreateJobRentalDto, ['user_id', 'job_id'] as const),
) {
    @ApiProperty({ example: true })
    @IsNotEmpty()
    @IsBoolean()
    is_finish: boolean
    
    public static getUpdateObject(data: UpdateJobRentalDto): Prisma.job_rentalUpdateInput {
        return data;
    }
}
