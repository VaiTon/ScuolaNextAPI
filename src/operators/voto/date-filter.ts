import IVoto from "../../api/voto";

export default (array: IVoto[], finishDate: Date, startDate?: Date): IVoto[] => {
    return array.filter(voto => {
        let ok = true
        const votoDate = new Date(voto.datGiorno)
        if ((votoDate > finishDate)
            || (startDate && (votoDate < startDate))) { ok = false }
        return ok
    });
}