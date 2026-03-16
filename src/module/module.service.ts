import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { PaginationDto } from 'src/common/dto';
import { changeTimeZone } from 'src/common';
import * as process from 'node:process';

@Injectable()
export class ModuleService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(ModuleService.name);

  //creación de modulo
  async create(createModuleDto: CreateModuleDto) {
    //validación de que no exista el modulo.
    const existModule = await this.findOneByName(createModuleDto.name);
    if (existModule) {
      this.logger.warn(`The module is already registered`);
      return {
        status: false,
        message: `The module is already registered`,
      };
    }

    //registro del nuevo modulo
    const newModule = await this.prisma.module
      .create({
        data: {
          ...createModuleDto,
          description: createModuleDto.description ?? '',
        },
      })
      .then((module) => {
        this.logger.log(`A new module has been created`);
        return module;
      });

    //validacíon de que se creo el modulo.

    if (!newModule) {
      this.logger.error(
        `The module could not be created ${createModuleDto.name}`,
      );
      return {
        status: false,
        message: 'Faild to create module',
      };
    }

    return {
      status: true,
      message: `The module has been created`,
      module: {
        ...newModule,
        createtAt: changeTimeZone(newModule.createdAt),
        updatedAt: changeTimeZone(newModule.updatedAt),
      },

    }
  }

  async findOneByName(name: string): Promise<boolean> {
    try {

      if (!name) return true;

      const foundModule = await this.prisma.module.findFirst({
        where: { name: name },
      });

      if (foundModule) return true;

      return false;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const {page, limit} = paginationDto;
    const modules = await this.prisma.module.findMany({
      select: {
        moduleid: true,
        name: true,
        description: true,
        enabled: true,
      },
      include: {
        creator: {
          name: true,
          lastnamefather: true,
          lastnamemother: true,
        },
        udater: {
          name: true,
          lastnamefather: true,
          lastnamemother: true,
        },
      },
      skip: (page - 1) * limit,
      limit: limit,
    });

    if (!modules) {
      this.logger.log(`There are no registered modules`);
      return {
        status: false,
        message: `There are no registered modules`,
      };
    }

    const totalRecords = await this.prisma.module.count();

    return {
      status: true,
      page: page,
      limit: limit,
      records: totalRecords,
      modules: modules,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} module`;
  }

  update(id: number, updateModuleDto: UpdateModuleDto) {
    return `This action updates a #${id} module`;
  }

  remove(id: number) {
    return `This action removes a #${id} module`;
  }
}
