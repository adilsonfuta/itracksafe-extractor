import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  messageStarted : string = "Server alive!"
  
  getHello(): string {
    return this.messageStarted;
  }
}
