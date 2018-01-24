export class Grupo {
    id: number;
    nombre: string;
    imagen: string;
    informacion: string;
    administrador: string;
    eventos: [{
      title: String,
      description: String,
      creditos: Number,
    }];
    tags: [Number];
}
