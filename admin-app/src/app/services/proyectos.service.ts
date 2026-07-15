import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Proyecto } from '../models/proyecto.interface';

@Injectable({ providedIn: 'root' })
export class ProyectosService {
    private readonly apiUrl = `${environment.apiUrl}/proyectos`;

    constructor(private http: HttpClient) {}

    // READ — lista todos los proyectos (publico, no necesita token)
    listar(): Observable<Proyecto[]> {
        return this.http.get<Proyecto[]>(this.apiUrl);
    }

    // READ ONE
    obtener(id: string): Observable<Proyecto> {
        return this.http.get<Proyecto>(`${this.apiUrl}/${id}`);
    }

    // CREATE — requiere estar logueado (el interceptor agrega el token)
    crear(proyecto: Proyecto): Observable<Proyecto> {
        return this.http.post<Proyecto>(this.apiUrl, proyecto);
    }

    // UPDATE — requiere estar logueado
    actualizar(id: string, proyecto: Partial<Proyecto>): Observable<Proyecto> {
        return this.http.put<Proyecto>(`${this.apiUrl}/${id}`, proyecto);
    }

    // DELETE — requiere estar logueado
    eliminar(id: string): Observable<{ mensaje: string }> {
        return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${id}`);
    }
}
