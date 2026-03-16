import { IsUUID } from 'class-validator';

export class FindUserDto {
  @IsUUID(4)
  userid: string;
}
