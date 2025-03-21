import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  private meses: string[] = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  transform(value: string | number): string {
    if (!value) return '-';
    const strValue = value.toString();
    if (strValue.length !== 8) return '-'; // Validar formato correcto YYYYMMDD

    const year = strValue.substring(0, 4);
    const monthIndex = parseInt(strValue.substring(4, 6), 10) - 1;
    const day = strValue.substring(6, 8);

    const month = this.meses[monthIndex] || '-';
    return `${day}-${month}-${year}`;
  }
}
