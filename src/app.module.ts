import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ModuleModule } from './module/module.module';

@Module({
  imports: [UserModule, PrismaModule, ModuleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
