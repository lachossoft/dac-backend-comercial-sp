import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class DisableUserDto extends PartialType(CreateUserDto) {
  @IsBoolean()
  enabled: boolean;
}
