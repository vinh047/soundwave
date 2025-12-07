import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import 'multer';
import toStream = require('streamifier');

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' }, // Tự động nhận diện mp3/image
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      toStream.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}