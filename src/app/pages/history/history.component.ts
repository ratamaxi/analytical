import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DateFormatPipe } from 'src/app/components/pipe/date-format.pipe';
import { TimeFormatPipe } from 'src/app/components/pipe/time-format.pipe';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, TimeFormatPipe, DateFormatPipe]
})
export class HistoryComponent implements OnDestroy{
  public busqueda: string = '';
    private destroy$: Subject<void> = new Subject();
    public data: Array<any> = [];
    public showEmpty:boolean = false;
    public busquedaEmpty: string = '';

    constructor(private generalService: GeneralService){}

    public buscarData():void{
      this.generalService.getHistorico(this.busqueda).pipe(takeUntil(this.destroy$)).subscribe({
        next:(resp) => { 
          this.showEmpty = true,
          this.data = resp.value;
          this.busquedaEmpty = this.busqueda;
        },
        error:(error) => { console.log(error)},
        complete:() => {
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
