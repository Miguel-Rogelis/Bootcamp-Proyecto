// Forma de un proyecto del portafolio, tal como se guarda en MongoDB
export interface Proyecto {
    _id?: string;
    titulo: string;
    descripcion: string;
    tecnologias: string[];
    imagen?: string;
    enlace?: string;
    destacado?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
