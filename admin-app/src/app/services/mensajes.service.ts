import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Mensaje } from '../models/mensaje.interface';

@Injectable({ providedIn: 'root' })
export class MensajesService {
    private readonly apiUrl = `${environment.apiUrl}/mensajes`;

    constructor(private http: HttpClient) {}

    // CREATE — publico, lo usa el formulario "Contáctame" del portafolio
    enviar(datos: Mensaje): Observable<{ mensaje: string; datos: Mensaje }> {
        return this.http.post<{ mensaje: string; datos: Mensaje }>(this.apiUrl, datos);
    }

    // READ — requiere sesion de admin (el interceptor agrega el token)
    listar(): Observable<Mensaje[]> {
        return this.http.get<Mensaje[]>(this.apiUrl);
    }

    // UPDATE — marcar como leido/no leido
    marcarLeido(id: string, leido: boolean): Observable<Mensaje> {
        return this.http.patch<Mensaje>(`${this.apiUrl}/${id}`, { leido });
    }

    // DELETE — requiere sesion de admin
    eliminar(id: string): Observable<{ mensaje: string }> {
        return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${id}`);
    }
}
