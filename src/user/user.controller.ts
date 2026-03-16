import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/';
import { UpdateUserDto } from './dto/';
import { PaginationDto } from 'src/common/dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }

  @Get(':userid')
  findOne(@Param('userid', new ParseUUIDPipe()) userid: string) {
    return this.userService.findOne(userid);
  }

  @Patch(':userid')
  update(
    @Param('userid', new ParseUUIDPipe()) userid: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(userid, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
