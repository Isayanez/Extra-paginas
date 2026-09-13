import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  isActive: number | boolean;
  roles: string[];
  empleado_id: number;
}

export interface AuthResponse extends AuthUser {
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  empleado_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:3000/api/auth';

  private readonly _currentUser = signal<AuthUser | null>(
    this.readStoredUser(),
  );

  readonly currentUser = this._currentUser.asReadonly();

  readonly isAuthenticated = computed(
    () => this._currentUser() !== null && !!this.getToken(),
  );

  readonly isAdmin = computed(
    () => this._currentUser()?.roles.includes('admin') ?? false,
  );

  login(data: LoginData) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, data)
      .pipe(
        tap((response) => {
          this.saveSession(response);
        }),
      );
  }

  register(data: RegisterData) {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, data)
      .pipe(
        tap((response) => {
          this.saveSession(response);
        }),
      );
  }

  checkStatus() {
    return this.http
      .get<AuthUser>(`${this.apiUrl}/check-status`)
      .pipe(
        tap((user) => {
          this._currentUser.set(user);
          localStorage.setItem(
            'soled_user',
            JSON.stringify(user),
          );
        }),
      );
  }

  logout(): void {
    localStorage.removeItem('soled_token');
    localStorage.removeItem('soled_user');

    this._currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('soled_token');
  }

  private saveSession(response: AuthResponse): void {
    const {
      token,
      ...user
    } = response;

    localStorage.setItem(
      'soled_token',
      token,
    );

    localStorage.setItem(
      'soled_user',
      JSON.stringify(user),
    );

    this._currentUser.set(user);
  }

  private readStoredUser(): AuthUser | null {
    const storedUser =
      localStorage.getItem('soled_user');

    if (!storedUser) {
      return null;
    }

    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      localStorage.removeItem('soled_user');
      return null;
    }
  }
}
