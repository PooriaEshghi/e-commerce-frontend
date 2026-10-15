import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export const AUTH_TOKEN_KEY = 'authToken';
const AUTH_EMAIL_KEY = 'authEmail';
const AUTH_ROLE_KEY = 'authRole';
const AUTH_NAME_KEY = 'authName';

export class AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = 'http://localhost:8080/api/auth/login';
  private registerUrl = 'http://localhost:8080/api/auth/register';

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(this.loginUrl, { email, password }).pipe(
      tap(response => this.store(response))
    );
  }

  register(email: string, password: string, firstName: string, lastName: string): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(this.registerUrl, {
      email,
      password,
      firstName,
      lastName
    }).pipe(
      tap(response => this.store(response))
    );
  }

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_EMAIL_KEY);
    localStorage.removeItem(AUTH_ROLE_KEY);
    localStorage.removeItem(AUTH_NAME_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  getEmail(): string | null {
    return localStorage.getItem(AUTH_EMAIL_KEY);
  }

  getRole(): string | null {
    return localStorage.getItem(AUTH_ROLE_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.isLoggedIn() && this.getRole() === 'ADMIN';
  }

  private store(response: AuthResponse): void {
    localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    localStorage.setItem(AUTH_EMAIL_KEY, response.email);
    localStorage.setItem(AUTH_ROLE_KEY, response.role);
    localStorage.setItem(AUTH_NAME_KEY, `${response.firstName || ''} ${response.lastName || ''}`.trim());
  }
}
