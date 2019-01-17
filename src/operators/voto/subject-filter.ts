import IVoto from "../../api/voto";


export default (array: IVoto[], materia: string): IVoto[] => {
    return array.filter(voto => materia === voto.desMateria.toLocaleUpperCase());
}
