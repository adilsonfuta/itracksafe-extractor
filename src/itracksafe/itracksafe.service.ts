import { Injectable } from '@nestjs/common';
import { CreateItracksafeDto } from './dto/create-itracksafe.dto';
import { UpdateItracksafeDto } from './dto/update-itracksafe.dto';

@Injectable()
export class ItracksafeService {
  create(createItracksafeDto: CreateItracksafeDto) {
    return 'This action adds a new itracksafe';
  }

  findAll() {
    return `This action returns all itracksafe`;
  }

  findOne(id: number) {
    return `This action returns a #${id} itracksafe`;
  }

  update(id: number, updateItracksafeDto: UpdateItracksafeDto) {
    return `This action updates a #${id} itracksafe`;
  }

  remove(id: number) {
    return `This action removes a #${id} itracksafe`;
  }
}
