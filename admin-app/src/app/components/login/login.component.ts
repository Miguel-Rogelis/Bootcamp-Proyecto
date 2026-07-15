import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    email = '';
    password = '';
    cargando = false;
    mensajeError = '';

    constructor(private authService: AuthService, private router: Router) {}

    onLogin(): void {
        this.mensajeError = '';
        this.cargando = true;

        this.authService.login({ email: this.email, password: this.password }).subscribe({
            next: () => {
                this.cargando = false;
                // Admin va al dashboard; un usuario normal va a la pagina principal
                const usuario = this.authService.getUsuario();
                this.router.navigate([usuario?.rol === 'admin' ? '/dashboard' : '/']);
            },
            error: (error) => {
                this.cargando = false;
                this.mensajeError = error?.error?.error || 'Email o contraseña incorrectos.';
            }
        });
    }
}
