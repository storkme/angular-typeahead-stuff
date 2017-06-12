import { Pipe, PipeTransform } from '@angular/core';
import { noop } from 'rxjs/util/noop';
@Pipe({
  pure: false,
  name: 'asyncError'
})
export class AsyncErrorPipe implements  PipeTransform{



  transform(value: any, ...args: any[]) {
    value.subscribe(noop, (err) => {
      
    })
  }


}
