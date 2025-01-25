import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { IFile } from '../interfaces/file.interface';

@Injectable()
export class FileRequiredPipe implements PipeTransform {
  transform(value?: IFile) {
    if (!value) {
      throw new BadRequestException('File is required');
    }
    return value;
  }
}
