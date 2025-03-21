import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class BaseComponent implements OnDestroy{
  public busqueda: string = '';
  public busquedaHandle: string = '';
  public busquedaEmpty: string = '';
  public data: Array<any> = [];
  private destroy$: Subject<void> = new Subject();
  public showEmpty:boolean = false

  constructor(private generalService: GeneralService){
  }

  public buscarData():void{
    this.generalService.getBaseInstalada(this.busqueda, this.busquedaHandle).pipe(takeUntil(this.destroy$)).subscribe({
      next:(resp) => { 
        this.showEmpty = true,
        this.data = resp.value,
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
