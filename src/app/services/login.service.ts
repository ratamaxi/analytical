import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginDataRequest, LoginResponse } from '../interface';

@Injectable()
export class LoginService {

  /**
   * Subject que almacena el Rol del usuario logueado.
   */
  private base_url: string = environment.base_url;
  private auth_url: string = environment.auth_url;

  constructor(private http: HttpClient, private router: Router) { }

  public get refreshToken(): string {
    return sessionStorage.getItem('refresh-token') || '';
  }

  public login(formData: LoginDataRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`/api/b1s/v2/Login`, formData)
      .pipe(
        tap((resp: LoginResponse) => {
          if (resp?.SessionId) {
            localStorage.setItem('sessionId', resp.SessionId);
            localStorage.setItem('user', formData.UserName);
          }
        })
      );
  }

  public logout(): void {
    localStorage.removeItem('sessionId');
    localStorage.removeItem('user');

    this.router.navigateByUrl('/login')
  }

  public isSessionValid(): boolean {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) return false;
    else return true
  }
}
