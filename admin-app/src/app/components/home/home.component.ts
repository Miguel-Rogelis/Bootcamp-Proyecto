import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ProyectosService } from '../../services/proyectos.service';
import { MensajesService } from '../../services/mensajes.service';
import { Proyecto } from '../../models/proyecto.interface';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
    // Proyectos que se muestran en la seccion "Portafolio" (vienen de MongoDB, ya no estan quemados)
    proyectos: Proyecto[] = [];
    cargandoProyectos = false;

    // Formulario de contacto
    contactoNombre = '';
    contactoEmail = '';
    contactoAsunto = '';
    contactoMensaje = '';
    enviandoContacto = false;
    contactoExito = '';
    contactoError = '';

    constructor(
        private authService: AuthService,
        private proyectosService: ProyectosService,
        private mensajesService: MensajesService
    ) {}

    ngOnInit(): void {
        this.cargarProyectos();
    }

    // El nav usa esto para saber si hay sesion activa y que nombre mostrar
    get usuario() {
        return this.authService.getUsuario();
    }

    get primerNombre(): string {
        const nombre = this.usuario?.nombre || '';
        return nombre.trim().split(' ')[0];
    }

    cerrarSesion(): void {
        this.authService.logout('/');
    }

    private cargarProyectos(): void {
        this.cargandoProyectos = true;
        this.proyectosService.listar().subscribe({
            next: (proyectos) => {
                this.proyectos = proyectos;
                this.cargandoProyectos = false;
            },
            error: () => {
                this.cargandoProyectos = false;
            }
        });
    }

    onEnviarContacto(): void {
        this.contactoError = '';
        this.contactoExito = '';
        this.enviandoContacto = true;

        this.mensajesService.enviar({
            nombre: this.contactoNombre,
            email: this.contactoEmail,
            asunto: this.contactoAsunto,
            mensaje: this.contactoMensaje
        }).subscribe({
            next: () => {
                this.enviandoContacto = false;
                this.contactoExito = 'Mensaje enviado. ¡Gracias por escribirme!';
                this.contactoNombre = '';
                this.contactoEmail = '';
                this.contactoAsunto = '';
                this.contactoMensaje = '';
            },
            error: (error) => {
                this.enviandoContacto = false;
                this.contactoError = error?.error?.error || 'No se pudo enviar el mensaje. Intenta de nuevo.';
            }
        });
    }
}
