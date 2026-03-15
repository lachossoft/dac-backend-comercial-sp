import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidateEmail } from 'src/common';
import { envs } from 'src/config';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(UserService.name);

  create(createUserDto: CreateUserDto) {
    try {
      const { email } = createUserDto;
      if (!ValidateEmail(email)) {
        this.logger.warn(
          `Attempt to create user with invalid email domain: ${email}`,
        );
        return {
          success: false,
          message:
            'Invalid email domain. Allowed domains are: ' +
            envs.validEmailDomains.join(', '),
        };
      }

      const user = this.prisma.user.create({
        data: {
          ...createUserDto,
          picture: createUserDto.picture ?? '', // Asegura que siempre sea string
        },
      });

      return {
        success: true,
        message: 'User created successfully',
        data: user,
      };
    } catch (error) {
      throw new Error('Failed to create user');
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
