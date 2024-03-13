import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalFormat'
})
export class DecimalFormatPipe implements PipeTransform {
  transform(value: number): string {
    // Round the number to 4 decimal places
    const roundedValue = value.toFixed(4);
    return `${roundedValue} hrs`; // Append 'hrs' to the formatted value
  }
}
