import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginPayload, LoginRespuesta, RegistroPayload, Usuario } from '../models/usuario.interface';

const TOKEN_KEY = 'token';
const USUARIO_KEY = 'usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly apiUrl = `${environment.apiUrl}/auth`;

    // Signal reactiva que indica si hay sesion activa (util para el header/nav)
    readonly logueado = signal<boolean>(this.tieneToken());

    constructor(private http: HttpClient, private router: Router) {}

    // POST /api/auth/register — crea un usuario nuevo
    registrar(datos: RegistroPayload): Observable<{ mensaje: string; usuario: Usuario }> {
        return this.http.post<{ mensaje: string; usuario: Usuario }>(`${this.apiUrl}/register`, datos);
    }

    // POST /api/auth/login — valida credenciales y guarda el token JWT
    login(datos: LoginPayload): Observable<LoginRespuesta> {
        return this.http.post<LoginRespuesta>(`${this.apiUrl}/login`, datos).pipe(
            tap((respuesta) => {
                localStorage.setItem(TOKEN_KEY, respuesta.token);
                localStorage.setItem(USUARIO_KEY, JSON.stringify(respuesta.usuario));
                this.logueado.set(true);
            })
        );
    }

    // POST /api/auth/forgot-password — genera un token de recuperacion (valido 15 min)
    solicitarRecuperacion(email: string): Observable<{ mensaje: string; resetToken?: string }> {
        return this.http.post<{ mensaje: string; resetToken?: string }>(`${this.apiUrl}/forgot-password`, { email });
    }

    // POST /api/auth/reset-password — cambia la contraseña usando el token recibido
    restablecerPassword(token: string, password: string): Observable<{ mensaje: string }> {
        return this.http.post<{ mensaje: string }>(`${this.apiUrl}/reset-password`, { token, password });
    }

    // Cierra la sesion y redirige (por defecto al login; la home puede pedir '/' )
    logout(redirigirA: string = '/login'): void {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USUARIO_KEY);
        this.logueado.set(false);
        this.router.navigate([redirigirA]);
    }

    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    getUsuario(): Usuario | null {
        const datos = localStorage.getItem(USUARIO_KEY);
        return datos ? JSON.parse(datos) : null;
    }

    private tieneToken(): boolean {
        return !!localStorage.getItem(TOKEN_KEY);
    }

    isLoggedIn(): boolean {
        return this.tieneToken();
    }
}
