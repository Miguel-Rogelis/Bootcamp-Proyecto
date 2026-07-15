import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    nombre = '';
    email = '';
    password = '';
    cargando = false;
    mensajeError = '';
    mensajeExito = '';

    constructor(private authService: AuthService, private router: Router) {}

    onRegistrar(): void {
        this.mensajeError = '';
        this.mensajeExito = '';
        this.cargando = true;

        this.authService.registrar({ nombre: this.nombre, email: this.email, password: this.password }).subscribe({
            next: () => {
                this.cargando = false;
                this.mensajeExito = 'Cuenta creada correctamente. Ya puedes iniciar sesión.';
                setTimeout(() => this.router.navigate(['/login']), 1200);
            },
            error: (error) => {
                this.cargando = false;
                this.mensajeError = error?.error?.error || 'No se pudo crear la cuenta.';
            }
        });
    }
}
