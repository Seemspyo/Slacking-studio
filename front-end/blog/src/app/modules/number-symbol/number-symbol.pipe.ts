/** Native Modules */
import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'numberSymbol'
})
export class NumberSymbolPipe implements PipeTransform {

  public transform(value: number): string {
    if (typeof value !== 'number') value = Number.parseInt(value);

    if (value >= Math.pow(10, 6)) return `${ Math.floor(value / Math.pow(10, 5)) / 10 } }M`;
    if (value >= Math.pow(10, 3)) return `${ Math.floor(value / Math.pow(10, 2)) / 10 }k`;
    return value.toString();
  }

}
