import * as fs from 'fs';
import { join } from 'path';
import { Logger } from '@nestjs/common';
import { envs } from 'src/config';

const logger = new Logger('ManagementFiles');

export const deleteFile = (folder: string, fileName: string) => {
  if (!fileName) return;

  const filePath = join(process.cwd(), envs.filedirectory, folder, fileName);
  logger.log(`filePath ${filePath}`);
  if (fs.existsSync(filePath)) {
    try {
      logger.log(`filePath ${filePath}`);
      fs.unlinkSync(filePath);
      logger.log(`The file has been deleted ${filePath}`);
    } catch (error) {
      logger.error(`Error deleting file ${filePath}`);
    }
  }
};
