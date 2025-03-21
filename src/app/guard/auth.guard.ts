import { inject } from "@angular/core";
import { Router, UrlTree } from "@angular/router";
import { LoginService } from "../services/login.service";

export const AuthGuard = (): boolean | UrlTree => {
  const router = inject(Router);
  const loginService = inject(LoginService)
  if (loginService.isSessionValid()) return true;
  else {
    router.navigate(['/login']);
    return false;
  }
}
