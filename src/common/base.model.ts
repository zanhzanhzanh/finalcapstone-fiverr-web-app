import { comment, job, job_rental, job_type, job_type_details, user } from '@prisma/client';

export type BaseModel =
| user
| comment
| job
| job_rental
| job_type
| job_type_details