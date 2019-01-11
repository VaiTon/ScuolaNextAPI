import IVoto from "../../models/voto";

export default (array: IVoto[]): number => {
    return array.reduce((accumulator, currentValue) =>
        accumulator + currentValue.decValore,
        0) / array.length;
}