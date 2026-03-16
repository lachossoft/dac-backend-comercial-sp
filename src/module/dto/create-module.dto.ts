import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateModuleDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsPositive()
  cspmoduleid: number;

  //quitar el campo cuando tengamos el token.
  @IsUUID()
  createdBy: string;

  @IsUUID()
  updatedBy: string;
}
