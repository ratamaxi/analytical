import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { DateFormatPipe } from 'src/app/components/pipe/date-format.pipe';
import { TimeFormatPipe } from 'src/app/components/pipe/time-format.pipe';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, TimeFormatPipe, DateFormatPipe, SpinnerComponent]
})
export class HistoryComponent implements OnDestroy{
  public busqueda: string = '';
    private destroy$: Subject<void> = new Subject();
    public data: Array<any> = [];
    public showEmpty:boolean = false;
    public busquedaEmpty: string = '';
    public spinner: boolean = false;

    constructor(private generalService: GeneralService){}

    public buscarData(): void {
      this.data = [];
      this.spinner = true
      this.cargarHistorico(this.busqueda).pipe(takeUntil(this.destroy$)).subscribe({
        next: (result:any[]) => {
          console.log(result)
          this.data = result.sort((a, b) => a["Llamada de Servicio"] - b["Llamada de Servicio"]);
          this.data = result;
          this.busquedaEmpty = this.busqueda;
          this.showEmpty = true;
        },
        error: (error:any) => {
          console.log(error);
        },
        complete: () => {
          this.spinner = false
          setTimeout(() => {
            this.showEmpty = false;
          }, 2000);
        }
      });
    }

    private cargarHistorico(busqueda: string, nextLink?: string, acumulado: any[] = []): Observable<any[]> {
      return this.generalService.getHistorico(busqueda, nextLink).pipe(
        switchMap((response) => {
          const nuevos = response.value || [];
          const acumuladoActualizado = [...acumulado, ...nuevos];
    
          if (response['@odata.nextLink']) {
            const next = response['@odata.nextLink'];
            return this.cargarHistorico(busqueda, next, acumuladoActualizado);
          } else {
            return of(acumuladoActualizado);
          }
        })
      );
    }
    
    

    public ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.unsubscribe();
    }
}
