import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Guard del dashboard: solo deja pasar a usuarios logueados CON rol admin.
// - Sin sesion -> a /login
// - Con sesion pero rol "usuario" -> a la pagina principal (no tiene permiso de admin)
export const adminGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
        router.navigate(['/login']);
        return false;
    }

    const usuario = authService.getUsuario();
    if (usuario?.rol === 'admin') {
        return true;
    }

    router.navigate(['/']);
    return false;
};
