import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return { ant: 'hello', name: 'world' };
  }
}
