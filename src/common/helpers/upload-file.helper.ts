import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { envs } from 'src/config';

//crear el archivo y lo almacena.
export const uploadFileConfig = (destination: string) => {
  return diskStorage({
    destination: `./${envs.filedirectory}/${destination}`,
    filename: (req, file, cb) => {
      const filename: string = uuidv4();
      const extension: string = extname(file.originalname);
      cb(null, `${filename}${extension}`);
    },
  });
};
