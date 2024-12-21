import { Injectable } from '@nestjs/common';

// これにより、このクラスがDIコンテナに登録されるので他のクラスで利用できるようになる
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
