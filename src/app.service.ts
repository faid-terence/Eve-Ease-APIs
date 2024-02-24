import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to TickNet APIs Version 1.0.0!';
  }
}
