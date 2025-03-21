import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import {
  MatCalendarCellClassFunction,
  MatDatepickerModule,
} from "@angular/material/datepicker";
import { MAT_DATE_LOCALE, DateAdapter } from "@angular/material/core";
import {
  MomentDateAdapter,
  MatMomentDateModule,
} from "@angular/material-moment-adapter";
import { MatFormFieldModule } from "@angular/material/form-field";
import "moment/locale/es";
import { FormsModule } from "@angular/forms";
import { GeneralService } from "src/app/services/general.service";
import { catchError, map, Observable, of, switchMap, take } from "rxjs";
import { FullCalendarModule } from "@fullcalendar/angular";
import { CalendarOptions } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { SpinnerComponent } from "src/app/components/spinner/spinner.component";
import Swal from 'sweetalert2'

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    MatMomentDateModule,
    FullCalendarModule,
    SpinnerComponent,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "es" },
    { provide: DateAdapter, useClass: MomentDateAdapter },
  ],
})
export class CalendarComponent {
  public selectedDate: Date | null = null;
  public startDate!: string;
  public endDate!: string;
  public dataCalendar: any;
  public dataFiltrada: Array<any> = [];
  public dataOriginal: Array<any> = [];
  public listaEmpleadosData: Array<any> = [];
  public showTable: boolean = false;
  public fechasMarcadas: Date[] = [];
  public employeeID!: number;
  public event: Array<{ title: string; date: string; end?: string }> = [];
  public showCalendar: boolean = false;
  public spinner: boolean = false;
  private isManualFilter: boolean = false;
  public showError: boolean = false;
  public mensajeError: string = '';

  constructor(private generalService: GeneralService) {
    this.listaEmpleados();
    this.obtenerDatos();
  }

  private listaEmpleados(): void {
    this.generalService
      .getEmployesGeneric()
      .pipe(take(1))
      .subscribe({
        next: (result) => (this.listaEmpleadosData = result.value),
        error: (error) => {
          this.showError = true;
          this.mensajeError = 'No se pudo consultar la lista de empleados'
        },
      });
  }

  public filtrarPorEmpleado(event: Event): void {
    this.dataFiltrada = [];
    const selectedEmployeeID = (event.target as HTMLSelectElement).value;
    if (selectedEmployeeID) {
      this.employeeID = Number(selectedEmployeeID);
      this.obtenerDataLimpia();
    }
  }

  private cargarTodoElCalendario(url?: string, acumulado: any[] = []): Observable<any[]> {
    return this.generalService.getCalendario(url).pipe(
      switchMap((response) => {
        const nuevos = response.value || [];
        const acumuladoActualizado = [...acumulado, ...nuevos];
  
        if (response['@odata.nextLink']) {
          const nextLink = response['@odata.nextLink'];
          return this.cargarTodoElCalendario(nextLink, acumuladoActualizado);
        } else {
          return of(acumuladoActualizado);
        }
      })
    );
  }
  

  private obtenerDatos(): void {
    this.spinner = true;
    this.generalService
      .getInternalKey()
      .pipe(
        take(1),
        switchMap((response) => {
          const internalKey = response?.value?.[0]?.InternalKey;
          if (!internalKey) {
            this.showError = true;
            this.mensajeError = "No se encontró InternalKey en la respuesta.";
            return of(null);
          }
          return this.generalService.getEmployedID(internalKey);
        }),
        switchMap((response) => {
          if (!response) return of([]);
  
          this.employeeID = response?.value?.[0]?.EmployeeID;
          if (!this.employeeID) {
            this.showError = true;
            this.mensajeError = "No se encontró EmployeeID en la respuesta.";
            return of([]);
          }
  
          return this.cargarTodoElCalendario(); // 🔥 Paginación completa
        }),
        catchError((error) => {
          this.showError = true;
          this.mensajeError = "Ocurrió un error al obtener los datos.";
          return of([]);
        })
      )
      .subscribe({
        next: (data: any[]) => {
          this.dataCalendar = data;
        },
        complete: () => this.obtenerDataLimpia()
      });
  }
  

  public filtrarEventos(): any[] {
    if (!this.employeeID || !this.dataCalendar.length) return [];

    return this.dataCalendar.filter((item: any) =>
      item.ServiceCallSchedulings.some(
        (sched: any) => sched.Technician === this.employeeID
      )
    );
  }

  public onDateSelected(date: Date | null): void {
    this.selectedDate = date;
  }

  public buscarFechas(): void {
    this.showTable = false;
    this.isManualFilter = true; 
    const startDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();

    this.dataFiltrada = this.dataCalendar
      .filter((data: any) => data.ServiceCallSchedulings?.length)
      .map((data: any) => data.ServiceCallSchedulings)
      .flat()
      .filter((item: any) => {
        const itemDate = new Date(item.StartDate).getTime();
        const isInDateRange =
          itemDate >= startTimestamp && itemDate <= endTimestamp;
        const isFromTechnician =
          !this.employeeID || item.Technician === this.employeeID;
        return isInDateRange && isFromTechnician;
      });

    this.obtenerDataLimpia();
  }

  public get validButton(): boolean {
    if (!this.startDate || !this.endDate) return false;
    else return true;
  }

  public calendarOptions: CalendarOptions = {
    initialView: "dayGridMonth",
    locale: esLocale,
    plugins: [dayGridPlugin, interactionPlugin],
    eventClick: this.handleEventClick.bind(this), 
    events: this.event,
    eventContent: (arg) => {
      const title = arg.event.title || '';
      const endTime = arg.event.extendedProps['endTime'] || '';
      const cliente = arg.event.extendedProps['cliente'] || '';
      const lds = arg.event.extendedProps['lds'] || '';
      const asunto = arg.event.extendedProps['asunto'] || '';
  
      return {
        html: `<div style="font-size: 12px; padding: 4px;">
          <strong>${title}</strong><br/>
          ${endTime}<br/>
          ${cliente}<br/>
          ${lds}<br/>
          ${asunto}
        </div>`
      };
    }
  };
  
  public handleEventClick(info: any): void {
    const evento = info.event;
    const descripcion = evento.extendedProps['description'];
    const ubicacion = evento.extendedProps['ubicacion'];
  
    Swal.fire({
      title: "Detalle del evento",
      html: `
      <p><strong>Descripción:</strong> ${descripcion}</p>
      <p><strong>Ubicación:</strong> ${ubicacion}</p>
    `,
      });
  }

  private obtenerDataLimpia(): void {
    console.log(this.dataCalendar)
    if (!this.isManualFilter && this.dataCalendar.length) {
      this.dataFiltrada = [];
      this.dataOriginal = [];
  
      this.dataCalendar
        .filter((data: any) => data.ServiceCallSchedulings?.length)
        .forEach((data: any) => {
          if (Array.isArray(data.ServiceCallSchedulings)) {
            const eventosFiltrados = data.ServiceCallSchedulings
              .filter((sched: any) => sched.Technician === this.employeeID)
              .map((sched: any) => ({
                ...sched,
                description: data.Description,
                customerCode: data.CustomerCode,           
                customerName: data.CustomerName,           
                docNum: data.DocNum,                   
                subject: data.Subject                 
              }));
  
            if (eventosFiltrados.length > 0) {
              this.dataFiltrada.push(...eventosFiltrados);
            }
          }
        });
    }
  
    this.mappingDataDate();
    this.showTable = true;
    this.isManualFilter = false;
  }
  

  private mappingDataDate(): void {
    this.spinner = false;
    if (!Array.isArray(this.dataFiltrada)) return;
    this.event = [];
    for (let data of this.dataFiltrada) {
      const dataMock = {
        title: data.StartTime ? `Inicio: ${data.StartTime}` : "Inicio: -",
        date: this.convertirFecha(data.StartDate),
        end: this.convertirFecha(data.EndDate),
        extendedProps: {
          endTime: data.EndTime ? `Fin: ${data.EndTime}` : "Fin: -",
          cliente: data.customerCode && data.customerName 
                    ? `${data.customerCode} - ${data.customerName}` 
                    : "Cliente: -",
          lds: data.docNum ? `LdS: ${data.docNum}` : "LdS: -",
          asunto: data.subject ? `Asunto: ${data.subject}` : "Asunto: -",
          description: data.description || 'Sin descripción',
          ubicacion: data.AddressText || 'Sin Ubicación'
        }
      };
      this.event.push(dataMock);
    }
    this.calendarOptions = {
      ...this.calendarOptions,
      events: [...this.event],
    };
  }

  private convertirFecha(fechaISO: string): string {
    if (!fechaISO) return "";
    const date = new Date(fechaISO);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  marcarFechas: MatCalendarCellClassFunction<Date> = (date: Date) => {
    return this.fechasMarcadas.some(
      (d) =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
    )
      ? "fecha-marcada"
      : "";
  };
}
