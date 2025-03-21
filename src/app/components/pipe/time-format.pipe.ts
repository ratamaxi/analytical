import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: true 
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: string | number): string {
    if (!value) return '-';
    const strValue = value.toString().padStart(4, '0');
    const hours = strValue.substring(0, 2);
    const minutes = strValue.substring(2, 4);
    return `${hours}:${minutes}`;
  }
}
