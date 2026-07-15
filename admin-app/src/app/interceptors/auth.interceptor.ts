import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

// Interceptor funcional: agrega automaticamente "Authorization: Bearer <token>"
// a cada peticion HTTP saliente, si hay sesion activa.
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    if (token) {
        const clonada = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        });
        return next(clonada);
    }

    return next(req);
};
