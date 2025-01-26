import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import * as moment from 'moment';

export class OptionalParseQueryDatePipe implements PipeTransform {
  transform(date: string, metadata: ArgumentMetadata) {
    if (date && !moment(Number(date)).isValid()) {
      throw new BadRequestException(`invalid ${metadata.data}`);
    }

    return date;
  }
}
