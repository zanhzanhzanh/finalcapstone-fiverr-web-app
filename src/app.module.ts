import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JobTypeModule } from './job_type/job_type.module';
import { JobModule } from './job/job.module';
import { CommentModule } from './comment/comment.module';
import { JobRentalModule } from './job-rental/job-rental.module';
import { JobTypeDetailsModule } from './job-type-details/job-type-details.module';
import { S3Module } from 'nestjs-s3';
import { MulterModule, MulterModuleOptions } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';

@Global()
@Module({
  imports: [
    // Config Env
    ConfigModule.forRoot({ isGlobal: true }),
    // Config S3
    S3Module.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configServer: ConfigService) => ({
        config: {
          credentials: {
            accessKeyId: configServer.get('ACCESS_KEY'),
            secretAccessKey: configServer.get('SECRET_ACCESS_KEY'),
          },
          region: configServer.get('BUCKET_REGION'),
          // endpoint: 'http://127.0.0.1:9000',
          // forcePathStyle: true,
          // signatureVersion: 'v4',
        },
      }),
      inject: [ConfigService]
    }),
    // Config for Upload File
    // Using @Global and export below to set global this
    MulterModule.registerAsync({
      useFactory: (): MulterModuleOptions => ({
        storage: memoryStorage(),
        limits: { fileSize: 10000000 },
        fileFilter: function (req, file, cb) {
            // Only accept .jpeg or .png
            const filetypes = /jpeg|jpg|png/;
            const extName = filetypes.test(extname(file.originalname).toLowerCase());
            const mimetype = filetypes.test(file.mimetype);
    
            if (mimetype && extName) {
                return cb(null, true);
            } else {
                cb(new Error('Only accept file .jpeg or .png'), false);
            }
        }
      })
    }),
    // Model
    UserModule,
    JobTypeModule,
    JobModule,
    CommentModule,
    JobRentalModule,
    JobTypeDetailsModule
  ],
  controllers: [AppController],
  providers: [AppService
  // This config apply ErrorFilter for All Router
  //   , {
  //   provide: APP_FILTER,
  //   useClass: ErrorFilter,
  // }
  ],
  exports:[MulterModule]
})
export class AppModule {}
