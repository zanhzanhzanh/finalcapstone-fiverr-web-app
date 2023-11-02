import { comment } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";

export async function updateJob(commentObj: comment, numberIncreases: number): Promise<void> {
    const initPrisma = new PrismaService();

    // Make new Avg for job_rate & rate_amount in job
    const valAvg = await initPrisma.comment.aggregate({
        _avg: {
            comment_rate: true
        },
        where: {
            job: {
                id: commentObj.job_id
            }
        }
    })

    await initPrisma.job.update({
        where: {
            id: commentObj.job_id
        },
        data: {
            rate_amount: {
                increment: numberIncreases,
            },
            job_rate: valAvg._avg.comment_rate
        }
    })
}