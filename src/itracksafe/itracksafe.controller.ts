import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItracksafeService } from './itracksafe.service';
import { CreateItracksafeDto } from './dto/create-itracksafe.dto';
import { UpdateItracksafeDto } from './dto/update-itracksafe.dto';

@Controller('itracksafe')
export class ItracksafeController {
  constructor(private readonly itracksafeService: ItracksafeService) {}
  
}
