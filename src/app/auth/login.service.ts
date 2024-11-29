import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  http = inject(HttpClient);
  API = environment.SERVIDOR + "usuario";

  constructor() { }

  login(loginData: any, ): Observable<any> {
    return this.http.post(`${this.API}/login`, {
      clientId: 'greenline-backend',
      grantType: 'password',
      username: loginData.username,
      password: loginData.password
    }).pipe(
      tap((response: any) => {
        console.log('Resposta do servidor:', response);
        if (response.access_token) {
          console.log('Token recebido:', response.access_token);
          this.addToken(response.access_token);
        } else {
          console.error('Token não encontrado na resposta.');
        }
      }),
      catchError((error) => {
        console.error('Erro ao fazer login:', error);
        return throwError(() => new Error('Falha ao fazer login, tente novamente.'));
      })
    );
  }

  addToken(token: string): void {
    if (token) {
      localStorage.setItem('token', token);
      console.log('Token Salvo:', token); // Log para confirmação
    } else {
      console.error('Tentativa de salvar um token indefinido');
    }
  }

  removerToken() {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken(); // Retorna `true` se o token estiver presente
  }

  getRole(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      // Acessa o papel do usuário em "resource_access.greenline-backend.roles"
      const roles = decodedToken.resource_access?.['greenline-backend']?.roles || [];
      return roles.length > 0 ? roles[0] : null;
    }
    return null;
  }

  getUserIdFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded?.sub || null; // Utiliza o campo 'sub' como o ID do usuário
    }
    return null;
  }

  hasPermission(role: string): boolean {
    const userRole = this.getRole();
    return userRole === role;
  }
}
