import IVoto from "../../models/voto";


export default (array: IVoto[], materia: string): IVoto[] => {
    return array.filter(voto => materia === voto.desMateria.toLocaleUpperCase());
}
