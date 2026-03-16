import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto, DisableUserDto } from './dto/';
import { UpdateUserDto } from './dto/';
import { PaginationDto } from 'src/common/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { changeTimeZone, deleteFile, ValidateEmail } from 'src/common';
import { envs } from 'src/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(UserService.name);

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  //Metodo para crear un nuevo usuario con validación de correo electrónico, verificación de existencia previa, hash de contraseña y manejo de errores
  async create(createUserDto: CreateUserDto) {
    try {
      const { email } = createUserDto;

      // Validar el dominio del correo electrónico
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

      // Verificar si el usuario ya existe

      const existingUser = await this.findOneByEmail(email);
      if (existingUser) {
        this.logger.warn(
          `Attempt to create user with existing email: ${email}`,
        );
        return {
          success: false,
          message: 'User with this email already exists',
        };
      }

      // Hash de la contraseña
      const passwordHash = await this.hashPassword(createUserDto.password);
      createUserDto.password = passwordHash;

      // Crear el usuario en la base de datos

      const newUser = await this.prisma.user
        .create({
          data: {
            ...createUserDto,
            picture: createUserDto.picture ?? '', // Asegura que siempre sea string
          },
        })
        .then((user) => {
          this.logger.log(`User created with email: ${user.email}`);
          return {
            user,
          };
        });

      //validación de creación de usuario

      if (!newUser) {
        this.logger.error(`Failed to create user with email: ${email}`);
        return {
          success: false,
          message: 'Failed to create user',
        };
      }

      this.logger.log(`User created successfully with email: ${email}`);

      return {
        success: true,
        message: 'User created successfully',
        data: {
          ...newUser.user,
          createdAt: changeTimeZone(newUser.user.createdAt),
          updatedAt: changeTimeZone(newUser.user.updatedAt),
        },
      };
    } catch (error) {
      this.handleError(error);
      return {
        success: false,
        message: 'An error occurred while creating the user',
      };
    }
  }

  // Método para encontrar un usuario por correo electrónico
  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  // Método para obtener una lista de usuarios con paginación, validación de resultados y manejo de errores
  async findAll(paginationDto: PaginationDto) {
    try {
      const { page, limit } = paginationDto;
      const users = await this.prisma.user
        .findMany({
          select: {
            userid: true,
            email: true,
            name: true,
            lastnamefather: true,
            lastnamemother: true,
            role: true,
            enabled: true,
          },
          where: {
            enabled: true,
          },
          skip: (page - 1) * limit,
          take: limit,
        })
        .then((users) => {
          this.logger.log(`Retrieved ${users.length} users from the database`);
          return {
            success: true,
            data: users,
          };
        });

      // Validación de resultados
      if (users.data.length === 0) {
        this.logger.warn(`No users found in the database`);
        return {
          success: false,
          message: 'No users found',
        };
      }

      const totalUsers = await this.prisma.user.count({
        where: {
          enabled: true,
        },
      });

      // Retornar los usuarios encontrados
      return {
        success: true,
        data: users,
        page: paginationDto.page,
        limit: paginationDto.limit,
        totalrecords: totalUsers,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  // Métodos de ejemplo para encontrar, actualizar y eliminar usuarios (pueden ser implementados posteriormente)
  async findOne(userid: string) {
    const userfound = await this.prisma.user.findUnique({
      select: {
        userid: true,
        email: true,
        name: true,
        lastnamefather: true,
        lastnamemother: true,
        role: true,
        picture: true,
        enabled: true,
      },
      where: { userid },
    });

    // Validación de resultados
    if (!userfound) {
      throw new NotFoundException(`User with ID ${userid} not found`);
    }

    return {
      success: true,
      data: userfound,
    };
  }

  async update(userid: string, updateUserDto: UpdateUserDto) {
    try {
      const { picture } = updateUserDto;
      const validUser = await this.findOne(userid);
      //valida si existe el usuario.
      if (!validUser) {
        throw new NotFoundException(`User with ID ${userid} not found`);
      }

      //se valida que exita la foto antirior y nueva
      if (picture && validUser.data.picture) {
        this.logger.log(`picture ${picture}`);
        this.logger.log(`validUser.picture ${validUser.data.picture}`);
        deleteFile(envs.profilepicturedirectory, validUser.data.picture);
      }
      const updateUser = await this.prisma.user.update({
        data: updateUserDto,
        where: {
          userid: userid,
        },
      });
      return {
        status: true,
        message: 'The user has been updated',
        updateUser: {
          ...updateUser,
          createdAt: changeTimeZone(updateUser.createdAt),
          updatedAt: changeTimeZone(updateUser.updatedAt),
        },
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async disable(userid: string, disableUserDto: DisableUserDto) {
    try {
      const validUser = await this.findOne(userid);
      //valida si existe el usuario.
      if (!validUser) {
        throw new NotFoundException(`User with ID ${userid} not found`);
      }

      const userDisable = await this.prisma.user.update({
        data: disableUserDto,
        where: {
          userid: userid,
        },
      });

      return {
        status: true,
        message: 'The user has been disabled',
        userDisable: {
          ...userDisable,
          createdAt: changeTimeZone(userDisable.createdAt),
          updatedAt: changeTimeZone(userDisable.updatedAt),
        },
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error.statusCode === '400') this.logger.error(error);
  }
}
