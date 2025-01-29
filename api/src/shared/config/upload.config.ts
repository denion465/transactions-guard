import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { extname, resolve } from 'node:path';

const destinationFilePath = resolve(__dirname, '../../../tmp');

const uploadConfig: MulterOptions = {
  dest: destinationFilePath,
  fileFilter: (_req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    const hasInvalidExtesion = !['.txt', '.rem'].includes(ext);

    if (hasInvalidExtesion) {
      return cb(
        new BadRequestException('Only .txt and .rem files are allowed'),
        false,
      );
    }
    cb(null, true);
  },
};

export { uploadConfig, destinationFilePath };
