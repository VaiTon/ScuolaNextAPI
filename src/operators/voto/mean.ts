import IVoto from "../../api/voto";

export default (array: IVoto[]): number => {
    return array.reduce((accumulator, currentValue) =>
        accumulator + currentValue.decValore,
        0) / array.length;
}