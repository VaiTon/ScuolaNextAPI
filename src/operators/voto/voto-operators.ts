import { Voto, Docente } from '../../api/types';
import { NO_VOTE, IM_VOTE } from '../../constants';

export function filterByDate(
  array: Voto[],
  finishDate: Date,
  startDate?: Date
): Voto[] {
  return array.filter(voto => {
    let ok = true;
    const votoDate = new Date(voto.datGiorno);
    if (votoDate > finishDate || (startDate && votoDate < startDate)) {
      ok = false;
    }
    return ok;
  });
}

export function mean(array: Voto[]): number {
  if (array.length === 0) return NaN;
  return (
    array.reduce(
      (accumulator, currentValue) => accumulator + currentValue.decValore,
      0
    ) / array.length
  );
}

export function filterBySubject(array: Voto[], materia: string): Voto[] {
  return array.filter(voto => materia === voto.desMateria.toLocaleUpperCase());
}

export function checkRealMark(voto: Voto): boolean {
  return !NO_VOTE.includes(voto.codVoto);
}
export function checkImpr(voto: Voto): boolean {
  return !IM_VOTE.includes(voto.codVoto);
}
const profD = '(Prof. '.length;
export function getDocente(voto: Voto): Docente {
  const nomi: string[] = voto.docente
    .substring(profD, voto.docente.length - 1)
    .split(' ')
    .map(str => titleCase(str));
  const cognome = nomi.shift();
  return { nome: nomi, cognome: cognome ? cognome : '' };
}
function titleCase(input: string): string {
  return input.length === 0
    ? ''
    : input.replace(
        /\w\S*/g,
        txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase()
      );
}
