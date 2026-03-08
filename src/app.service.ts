import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
 
  message : string = "Server alive!"
  
  getHello(): string {
    return this.message;
  }
}
