import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import ImageKit from 'imagekit';
import { Express } from 'express';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

@Injectable()
export class UploadService {
  private imageKit: ImageKit;

  constructor() {
    this.imageKit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
    try {
      const response = await this.imageKit.upload({
        file: file.buffer.toString('base64'),
        fileName: file.originalname,
      });
      return response;
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.imageKit.deleteFile(fileId);
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
}
