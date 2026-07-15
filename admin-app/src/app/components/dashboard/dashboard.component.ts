import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProyectosService } from '../../services/proyectos.service';
import { MensajesService } from '../../services/mensajes.service';
import { AuthService } from '../../services/auth.service';
import { Proyecto } from '../../models/proyecto.interface';
import { Mensaje } from '../../models/mensaje.interface';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
    proyectos: Proyecto[] = [];
    cargando = false;
    error = '';

    // Modelo del formulario de creacion / edicion
    formulario: Proyecto = this.formularioVacio();
    editandoId: string | null = null;
    tecnologiasTexto = '';

    // Mensajes de contacto recibidos desde el portafolio
    mensajes: Mensaje[] = [];
    cargandoMensajes = false;
    errorMensajes = '';

    constructor(
        private proyectosService: ProyectosService,
        private mensajesService: MensajesService,
        private authService: AuthService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.cargarProyectos();
        this.cargarMensajes();
    }

    get mensajesSinLeer(): number {
        return this.mensajes.filter((m) => !m.leido).length;
    }

    cargarMensajes(): void {
        this.cargandoMensajes = true;
        this.mensajesService.listar().subscribe({
            next: (mensajes) => {
                this.mensajes = mensajes;
                this.cargandoMensajes = false;
            },
            error: () => {
                this.errorMensajes = 'No se pudieron cargar los mensajes.';
                this.cargandoMensajes = false;
            }
        });
    }

    marcarLeido(mensaje: Mensaje): void {
        if (!mensaje._id || mensaje.leido) return;
        this.mensajesService.marcarLeido(mensaje._id, true).subscribe({
            next: (actualizado) => {
                mensaje.leido = actualizado.leido;
            }
        });
    }

    eliminarMensaje(mensaje: Mensaje): void {
        if (!mensaje._id) return;
        if (!confirm(`¿Eliminar el mensaje de "${mensaje.nombre}"?`)) return;

        this.mensajesService.eliminar(mensaje._id).subscribe({
            next: () => this.cargarMensajes(),
            error: (error) => {
                this.errorMensajes = error?.error?.error || 'No se pudo eliminar el mensaje.';
            }
        });
    }

    get usuario() {
        return this.authService.getUsuario();
    }

    cargarProyectos(): void {
        this.cargando = true;
        this.proyectosService.listar().subscribe({
            next: (proyectos) => {
                this.proyectos = proyectos;
                this.cargando = false;
            },
            error: () => {
                this.error = 'No se pudieron cargar los proyectos.';
                this.cargando = false;
            }
        });
    }

    // CREATE / UPDATE — el mismo formulario sirve para ambos casos
    guardar(): void {
        this.error = '';
        this.formulario.tecnologias = this.tecnologiasTexto
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t.length > 0);

        const peticion = this.editandoId
            ? this.proyectosService.actualizar(this.editandoId, this.formulario)
            : this.proyectosService.crear(this.formulario);

        peticion.subscribe({
            next: () => {
                this.cancelarEdicion();
                this.cargarProyectos();
            },
            error: (error) => {
                this.error = error?.error?.error || 'Error al guardar el proyecto.';
            }
        });
    }

    editar(proyecto: Proyecto): void {
        this.editandoId = proyecto._id ?? null;
        this.formulario = { ...proyecto };
        this.tecnologiasTexto = (proyecto.tecnologias || []).join(', ');
    }

    eliminar(proyecto: Proyecto): void {
        if (!proyecto._id) return;
        if (!confirm(`¿Eliminar el proyecto "${proyecto.titulo}"?`)) return;

        this.proyectosService.eliminar(proyecto._id).subscribe({
            next: () => this.cargarProyectos(),
            error: (error) => {
                this.error = error?.error?.error || 'No se pudo eliminar el proyecto.';
            }
        });
    }

    cancelarEdicion(): void {
        this.editandoId = null;
        this.formulario = this.formularioVacio();
        this.tecnologiasTexto = '';
    }

    cerrarSesion(): void {
        this.authService.logout();
    }

    private formularioVacio(): Proyecto {
        return {
            titulo: '',
            descripcion: '',
            tecnologias: [],
            imagen: '',
            enlace: '',
            destacado: false
        };
    }
}
