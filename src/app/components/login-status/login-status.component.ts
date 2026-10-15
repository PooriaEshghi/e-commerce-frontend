import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent {

  constructor(public authService: AuthService,
              private router: Router) { }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/products');
  }
}
