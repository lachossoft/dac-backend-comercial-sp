import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserRole } from './user-role';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  lastnamefather: string;

  @IsString()
  lastnamemother: string;

  @IsStrongPassword()
  password: string;

  @IsEnum(UserRole, { message: 'role must be either ROOT, ADMIN, or USER' })
  role: UserRole;

  @IsOptional()
  @IsString()
  picture?: string;
}
