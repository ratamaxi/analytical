import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  constructor(private http: HttpClient) {}

  public getBaseInstalada(number: string, handle?: string): Observable<any> {
    let params: string = this.esSoloNumeros(number) ? 'CustomerCode' : 'CustomerName';
    if(handle) params = 'U_SEI_SYSTEMHandle';
    const sessionId = localStorage.getItem('sessionId') || '';
    const headers = new HttpHeaders({
      'Cookie': sessionId,
      'Prefer': 'odata.maxpagesize=100'
    });
    return this.http.get<any>(
      `/api/b1s/v2/CustomerEquipmentCards?$select=EquipmentCardNum,CustomerCode,CustomerName,ItemCode,ItemDescription,InternalSerialNum,U_SEI_SYSTEMHandle,U_SEI_TagCliente,U_PL,Street,City,StatusOfSerialNumber,StateCode,CountryCode&$filter=(${params} eq '${number}')&$orderby=EquipmentCardNum`,
      { headers }
    );
  }

  public getDataCliente(data: string): Observable<any> {
    let params: string = this.esSoloNumeros(data) ? 'CardCode' : 'CardName';
    const sessionId = localStorage.getItem('sessionId') || '';
    const headers = new HttpHeaders({
      'Cookie': sessionId,
      'Prefer': 'odata.maxpagesize=100'
    });
    return this.http.get<any>(
      `/api/b1s/v2/BusinessPartners?$select=CardCode,CardName,Address,City,Country,ZipCode,ContactPerson,FederalTaxID,EmailAddress,BPAddresses,ContactEmployees&$filter=(${params} eq '${data}')`,
      { headers }
    );
  }

  public getListaDataCliente(data: string): Observable<any> {
    let params: string = this.esSoloNumeros(data) ? 'CardCode' : 'CardName';
    const sessionId = localStorage.getItem('sessionId') || '';
    const headers = new HttpHeaders({
      'Cookie': sessionId,
      'Prefer': 'odata.maxpagesize=100'
    });
    return this.http.get<any>(
      `/api/b1s/v2/BusinessPartners?$select=CardCode,CardName,FederalTaxID&$filter=contains(${params}, '${data}')`,
      { headers }
    );
  }

  public getInternalKey(): Observable<any> {
    const user = localStorage.getItem('user');
    const sessionId = localStorage.getItem('sessionId') || '';
    const headers = new HttpHeaders({
      'Cookie': sessionId,
    });
    return this.http.get<any>(
      `/api/b1s/v2/Users?$select=InternalKey&$filter=UserCode eq '${user}'`,
      { headers }
    );
  }

  public getEmployedID(id:number): Observable<any> {
    const sessionId = localStorage.getItem('sessionId') || '';
    const headers = new HttpHeaders({
      'Cookie': sessionId,
    });
    return this.http.get<any>(
      `/api/b1s/v2/EmployeesInfo?$select=EmployeeID,FirstName,LastName,ApplicationUserID&$filter=ApplicationUserID eq ${id}`,
      { headers }
    );
  }

  public getEmployesGeneric(): Observable<any> {
    const sessionId = localStorage.getItem('sessionId') || '';
    const headers = new HttpHeaders({
      'Cookie': sessionId,
    });
    return this.http.get<any>(
      `/api/b1s/v2/EmployeesInfo?$select=EmployeeID,FirstName,LastName,ApplicationUserID`,
      { headers }
    );
  }
  
  public getCalendario(): Observable<any> {
    const sessionId = localStorage.getItem('sessionId') || '';
    const headers = new HttpHeaders({
      'Cookie': sessionId,
      'Prefer': 'odata.maxpagesize=100'
    });
    return this.http.get<any>(
      `/api/b1s/v2/ServiceCalls?$skip=0&$select=DocNum,CustomerCode,CustomerName,Subject,ServiceCallSchedulings,Description`,
      { headers }
    );
  }

  public getHistorico(number: string): Observable<any> {
    const sessionId = localStorage.getItem('sessionId') || '';
    const headers = new HttpHeaders({
      'Cookie': sessionId,
      'Prefer': 'odata.maxpagesize=100'
    });
    const body = {
      "ParamList": `SerialNumber='${number}'&SystemHandle='${number}'`
    }
    return this.http.post<any>(
      `/api/b1s/v2/SQLQueries('API_HistorialAsistSN')/List`,body,{ headers },
    );
  }

  private esSoloNumeros(value: string): boolean {
    return /^\d+$/.test(value);
  }
}
