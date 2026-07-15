// Forma de un mensaje de contacto, tal como se guarda en MongoDB
export interface Mensaje {
    _id?: string;
    nombre: string;
    email: string;
    asunto?: string;
    mensaje: string;
    leido?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
