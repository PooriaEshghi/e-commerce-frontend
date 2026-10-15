import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;
  registerFormGroup: FormGroup;
  mode: 'login' | 'register' = 'login';
  errorMessage = '';
  returnUrl = '/products';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.loginFormGroup = this.formBuilder.group({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
      ]),
      password: new FormControl('', [Validators.required]),
    });
    this.registerFormGroup = this.formBuilder.group({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  ngOnInit(): void {
    this.returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl') || '/products';
  }

  get loginEmail() {
    return this.loginFormGroup.get('email');
  }
  get loginPassword() {
    return this.loginFormGroup.get('password');
  }
  get registerEmail() {
    return this.registerFormGroup.get('email');
  }
  get registerPassword() {
    return this.registerFormGroup.get('password');
  }

  showLogin(): void {
    this.mode = 'login';
    this.errorMessage = '';
  }

  showRegister(): void {
    this.mode = 'register';
    this.errorMessage = '';
  }

  onLogin(): void {
    if (this.loginFormGroup.invalid) {
      this.loginFormGroup.markAllAsTouched();
      return;
    }
    const value = this.loginFormGroup.value;
    this.authService.login(value.email, value.password).subscribe({
      next: () => this.afterAuth(),
      error: (err) =>
        (this.errorMessage = err?.error?.message || 'Login failed'),
    });
  }

  onRegister(): void {
    if (this.registerFormGroup.invalid) {
      this.registerFormGroup.markAllAsTouched();
      return;
    }
    const value = this.registerFormGroup.value;
    this.authService
      .register(value.email, value.password, value.firstName, value.lastName)
      .subscribe({
        next: () => this.afterAuth(),
        error: (err) =>
          (this.errorMessage = err?.error?.message || 'Registration failed'),
      });
  }

  private afterAuth(): void {
    if (this.returnUrl.startsWith('/admin') && !this.authService.isAdmin()) {
      this.errorMessage = 'This account is not an admin.';
      return;
    }
    this.router.navigateByUrl(this.returnUrl);
  }
}
