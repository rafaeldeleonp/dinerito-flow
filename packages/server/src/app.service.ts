import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Hello World!',
      status: 'success',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }
}
