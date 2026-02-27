import { PartialType } from '@nestjs/mapped-types';
import { CreateItracksafeDto } from './create-itracksafe.dto';

export class UpdateItracksafeDto extends PartialType(CreateItracksafeDto) {}
