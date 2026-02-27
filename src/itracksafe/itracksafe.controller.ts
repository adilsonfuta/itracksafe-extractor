import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItracksafeService } from './itracksafe.service';
import { CreateItracksafeDto } from './dto/create-itracksafe.dto';
import { UpdateItracksafeDto } from './dto/update-itracksafe.dto';

@Controller('itracksafe')
export class ItracksafeController {
  constructor(private readonly itracksafeService: ItracksafeService) {}

  @Post()
  create(@Body() createItracksafeDto: CreateItracksafeDto) {
    return this.itracksafeService.create(createItracksafeDto);
  }

  @Get()
  findAll() {
    return this.itracksafeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itracksafeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItracksafeDto: UpdateItracksafeDto) {
    return this.itracksafeService.update(+id, updateItracksafeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itracksafeService.remove(+id);
  }
}
