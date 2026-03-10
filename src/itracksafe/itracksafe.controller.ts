import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItracksafeService } from './itracksafe.service';

@Controller('itracksafe')
export class ItracksafeController {
  constructor(private readonly itracksafeService: ItracksafeService) {}
  
}
