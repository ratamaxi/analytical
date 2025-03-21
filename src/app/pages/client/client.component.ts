import { CommonModule } from "@angular/common";
import { Component, OnDestroy } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Observable, of, Subject, switchMap, takeUntil } from "rxjs";
import { SpinnerComponent } from "src/app/components/spinner/spinner.component";
import { GeneralService } from "src/app/services/general.service";

@Component({
  selector: "app-client",
  templateUrl: "./client.component.html",
  styleUrls: ["./client.component.scss"],
  standalone: true,
  imports: [CommonModule, FormsModule, SpinnerComponent],
})
export class ClientComponent implements OnDestroy{
  public busqueda: string = "";
  private destroy$: Subject<void> = new Subject();
  public data: Array<any> = [];
  public dataList: Array<any> = [];
  public showEmpty: boolean = false;
  public spinner: boolean = false;
  public busquedaEmpty: string = "";

  constructor(private generalService: GeneralService) {}

  public buscarDataLista(): void {
    this.spinner = true;
    this.data = [];
    this.dataList = [];
  
    this.cargarTodosLosClientes(this.busqueda).pipe(takeUntil(this.destroy$)).subscribe({
      next: (result) => {
        this.dataList = result;
        this.busquedaEmpty = this.busqueda;
        this.showEmpty = true;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.spinner = false;
        setTimeout(() => {
          this.showEmpty = false;
        }, 2000);
      }
    });
  }

  private cargarTodosLosClientes(busqueda: string, nextLink?: string, acumulado: any[] = []): Observable<any[]> {
    return this.generalService.getListaDataCliente(busqueda, nextLink).pipe(
      switchMap((response) => {
        const nuevos = response.value || [];
        const acumuladoActualizado = [...acumulado, ...nuevos];
  
        if (response['@odata.nextLink']) {
          const next = response['@odata.nextLink'];
          return this.cargarTodosLosClientes(busqueda, next, acumuladoActualizado);
        } else {
          return of(acumuladoActualizado);
        }
      })
    );
  }
  
  
      public buscarData(code: string):void{
        this.spinner = true;
        this.data = [];
        this.dataList = [];
        this.generalService.getDataCliente(code).pipe(takeUntil(this.destroy$)).subscribe({
          next:(resp) => { 
            this.showEmpty = true,
            this.data = resp.value;
            this.busquedaEmpty = this.busqueda;
          },
          error:(error) => { console.log(error)},
          complete:() => {
            this.spinner = false;
            setTimeout(() => {
              this.showEmpty = false;
            },2000);
          }
        })
      }
  
      public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.unsubscribe();
      }
}
