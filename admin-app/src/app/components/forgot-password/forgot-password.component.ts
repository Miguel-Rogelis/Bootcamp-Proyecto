import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
    email = '';
    cargando = false;
    mensajeError = '';
    mensajeExito = '';
    // Token de restablecimiento: se muestra en pantalla porque el proyecto
    // todavia no tiene un servicio de email (SMTP) configurado para enviarlo.
    resetToken = '';

    constructor(private authService: AuthService) {}

    onSolicitar(): void {
        this.mensajeError = '';
        this.mensajeExito = '';
        this.resetToken = '';
        this.cargando = true;

        this.authService.solicitarRecuperacion(this.email).subscribe({
            next: (respuesta) => {
                this.cargando = false;
                this.mensajeExito = respuesta.mensaje;
                if (respuesta.resetToken) {
                    this.resetToken = respuesta.resetToken;
                }
            },
            error: (error) => {
                this.cargando = false;
                this.mensajeError = error?.error?.error || 'No se pudo procesar la solicitud.';
            }
        });
    }
}
