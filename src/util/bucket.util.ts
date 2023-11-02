import { DeleteObjectCommand, PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";
import * as sharp from "sharp";

export async function uploadImage(s3: S3, configService: ConfigService, file: Express.Multer.File): Promise<string> {
    // Resize Image
    const newBuffer = await sharp(file.buffer).resize({
        height: 1024, width: 768 , fit: 'contain'
    }).toBuffer()

    const imageName = Date.now() + '-' + file.originalname;

    // Config Command for S3
    const command = new PutObjectCommand({
        Bucket: configService.get('BUCKET_NAME'),
        Key: imageName,
        Body: newBuffer,
        ACL: 'public-read',
        ContentType: file.mimetype
    })

    await s3.send(command);
    
    return 'https://' + configService.get('BUCKET_NAME') + '.s3.' + configService.get('BUCKET_REGION') + '.amazonaws.com/' + imageName;
}

export async function delImage(s3: S3, configServer: ConfigService, imagePath: string): Promise<void> {
    const pathArr = imagePath.split('/');
    
    const command = new DeleteObjectCommand({
        Bucket: configServer.get('BUCKET_NAME'),
        Key: pathArr[pathArr.length - 1]
    })
    await s3.send(command);
}

export async function findAndDelImage(modelName: string, s3: S3, configService: ConfigService, convertBuffer: Buffer) {
    const findObj = await new PrismaClient()[modelName].findUnique({
        where: { id: convertBuffer }
    })
    if(findObj === null) throw new Error(`Record of ${modelName} not found`);
    await delImage(s3, configService, findObj.image);
}