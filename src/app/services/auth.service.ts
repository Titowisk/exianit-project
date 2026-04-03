import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { APP_CONFIG } from '../models/app-config.interface';

export interface SignUpResponse {
  id: string;
  email: string;
}

export interface LoginResponse {
  token: string;
}

interface JwtPayload {
  sub: string;
  email: string;
  jti: string;
  exp: number;
  iss: string;
  aud: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);
  private get apiUrl() { return this.config.apiUrl + '/auth'; }
  private readonly TOKEN_KEY = 'auth_token';

  private _userId = signal<string | null>(null);
  userId = this._userId.asReadonly();
  
  isAuthenticated = computed(() => !!this._userId());

  signUp(email: string, password: string): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(`${this.apiUrl}/sign-up`, {
      email,
      password
    });
  }

  constructor() {
    // Initialize userId from token if it exists and is valid
    const token = this.getToken();
    if (token) {
      // Auto-clear expired tokens on app initialization
      if (this.isTokenExpired(token)) {
        this.clearToken();
      } else {
        const userId = this.extractUserIdFromToken(token);
        this._userId.set(userId);
      }
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      email,
      password
    }).pipe(
      tap(response => this.saveToken(response.token))
    );
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token); // ToDo: is this safe ?
    const userId = this.extractUserIdFromToken(token);
    this._userId.set(userId);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this._userId.set(null);
  }

  isTokenExpired(token?: string): boolean {
    const tokenToCheck = token || this.getToken();
    if (!tokenToCheck) {
      return true;
    }

    try {
      const payload = this.decodeToken(tokenToCheck);
      if (!payload || !payload.exp) {
        return true;
      }

      // JWT exp is in seconds, Date.now() is in milliseconds
      const expirationTime = payload.exp * 1000;
      return Date.now() >= expirationTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  logout(): void {
    this.clearToken();
  }

  private extractUserIdFromToken(token: string): string | null {
    try {
      const payload = this.decodeToken(token);
      return payload?.sub || null;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  private decodeToken(token: string): JwtPayload | null {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) {
        return null;
      }
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
