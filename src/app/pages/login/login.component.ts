import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Component, HostBinding, OnDestroy, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { LoginDataRequest } from "src/app/interface";
import { LoginService } from "src/app/services/login.service";
import Swal from "sweetalert2";
import { environment } from 'src/environments/environment';


@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers:[LoginService]
})
export class LoginComponent implements OnDestroy {
  private name_BD: string = environment.name_BD;
  private destroy$: Subject<void> = new Subject();

  public formSubmite = false;
  public loginForm = this.fb.group({
    name: ["", [Validators.required]],
    password: ["", [Validators.required]],
  });


  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    // private spinnerService: SpinnerService,
    private router: Router
  ) {
    sessionStorage.removeItem("token");
  }

  public login(): void {
    let mappingData: LoginDataRequest = {
      CompanyDB: this.name_BD,
      UserName: this.getNameForm.value || '',
      Password: this.getPasswordForm.value || '',
    }
    localStorage.clear();
    sessionStorage.removeItem("token");
    //this.spinnerService.setSpinnerState(true);
    this.loginService.login(mappingData).subscribe({
      next: () => {
        this.router.navigate(['/panel/home'])
      },
      error: (err) => {
        console.log(err)
        Swal.fire("Error", 'El usuario o contraseña son incorrectos', "error");
        //this.spinnerService.setSpinnerState(false);
      },
      complete: () => {
        //this.spinnerService.setSpinnerState(false);
      },
    });
  }

  public get isValid(): boolean {
    return this.loginForm.valid;
  }

  public get getNameForm(): AbstractControl<string | null>{
    return this.loginForm.controls['name'];
  }

  public get getPasswordForm(): AbstractControl<string | null>{
    return this.loginForm.controls['password'];
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
