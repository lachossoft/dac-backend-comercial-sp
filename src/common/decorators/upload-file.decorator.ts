import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadFileConfig } from '../helpers';

//Decorador para la validacion de la carga de los archivos.
export function UploadFile(filename: string, folder: string) {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor(filename, {
        storage: uploadFileConfig(folder),
      }),
    ),
  );
}
