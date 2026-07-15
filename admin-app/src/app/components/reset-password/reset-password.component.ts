import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
    token = '';
    password = '';
    confirmarPassword = '';
    cargando = false;
    mensajeError = '';
    mensajeExito = '';
    tokenPresente = true;

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.token = this.route.snapshot.queryParamMap.get('token') || '';
        this.tokenPresente = !!this.token;
        if (!this.tokenPresente) {
            this.mensajeError = 'Este enlace no tiene un token válido. Solicita uno nuevo.';
        }
    }

    onRestablecer(): void {
        this.mensajeError = '';
        this.mensajeExito = '';

        if (this.password !== this.confirmarPassword) {
            this.mensajeError = 'Las contraseñas no coinciden.';
            return;
        }

        this.cargando = true;
        this.authService.restablecerPassword(this.token, this.password).subscribe({
            next: (respuesta) => {
                this.cargando = false;
                this.mensajeExito = respuesta.mensaje;
                setTimeout(() => this.router.navigate(['/login']), 1500);
            },
            error: (error) => {
                this.cargando = false;
                this.mensajeError = error?.error?.error || 'No se pudo restablecer la contraseña.';
            }
        });
    }
}
