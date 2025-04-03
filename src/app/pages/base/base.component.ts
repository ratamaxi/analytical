import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { SpinnerComponent } from 'src/app/components/spinner/spinner.component';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, SpinnerComponent]
})
export class BaseComponent implements OnDestroy{
  public busqueda: string = '';
  public busquedaHandle: string = '';
  public busquedaEmpty: string = '';
  public data: Array<any> = [];
  private destroy$: Subject<void> = new Subject();
  public showEmpty:boolean = false;
  public spinner: boolean = false;

  constructor(private generalService: GeneralService){
  }

  public buscarData(): void {
    this.data = [];
    this.spinner = true;
    this.cargarBaseInstalada(this.busqueda.toUpperCase(), this.busquedaHandle.toUpperCase()).pipe(takeUntil(this.destroy$)).subscribe({
      next: (result) => {
        this.data = result;
        this.busquedaEmpty = this.busqueda;
        this.showEmpty = true;
      },
      error: (error) => {
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

  private cargarBaseInstalada(busqueda: string, handle?: string, nextLink?: string, acumulado: any[] = []): Observable<any[]> {
    return this.generalService.getBaseInstalada(busqueda, handle, nextLink).pipe(
      switchMap((response) => {
        const nuevos = response.value || [];
        const acumuladoActualizado = [...acumulado, ...nuevos];
  
        if (response['@odata.nextLink']) {
          const next = response['@odata.nextLink'];
          return this.cargarBaseInstalada(busqueda, handle, next, acumuladoActualizado);
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
