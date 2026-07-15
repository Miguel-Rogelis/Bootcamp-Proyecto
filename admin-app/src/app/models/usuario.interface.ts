// Forma de un usuario tal como lo devuelve el backend (sin password)
export interface Usuario {
    id?: string;
    _id?: string;
    nombre: string;
    email: string;
    rol?: string;
}

// Datos que se envian al registrar un usuario nuevo
export interface RegistroPayload {
    nombre: string;
    email: string;
    password: string;
}

// Datos que se envian al iniciar sesion
export interface LoginPayload {
    email: string;
    password: string;
}

// Respuesta del backend al iniciar sesion (incluye el JWT)
export interface LoginRespuesta {
    mensaje: string;
    token: string;
    usuario: Usuario;
}
