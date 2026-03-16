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
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, DisableUserDto } from './dto/';
import { UpdateUserDto } from './dto/';
import { PaginationDto } from 'src/common/dto';
import { UploadFile } from 'src/common/decorators';
import { envs } from 'src/config';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UploadFile('picture', envs.profilepicturedirectory) //cargamos el archivo
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file);
    if (file) createUserDto.picture = file.filename;
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
  @UploadFile('picture', 'profile-pictures')
  update(
    @Param('userid', new ParseUUIDPipe()) userid: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) updateUserDto.picture = file.filename;
    return this.userService.update(userid, updateUserDto);
  }

  @Delete(':userid')
  disable(
    @Param('userid', new ParseUUIDPipe()) userid: string,
    @Body() disableUserDto: DisableUserDto,
  ) {
    return this.userService.disable(userid, disableUserDto);
  }
}
