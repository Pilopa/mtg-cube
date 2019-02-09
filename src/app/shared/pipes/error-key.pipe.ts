import { Pipe, PipeTransform } from '@angular/core';
import { FirebaseError } from 'firebase';
import { AppError } from '@app/shared/models/error.model';

@Pipe({
  name: 'errorKey',
  pure: true
})
export class ErrorKeyPipe implements PipeTransform {

  transform(error: FirebaseError | AppError): any {
    return `${(error.code || error.message).replace(/\//g, '.')}`;
  }

}
