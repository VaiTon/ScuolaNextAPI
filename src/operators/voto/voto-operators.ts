import { Docente, Voto } from '../../api/types';
import { IM_VOTE, NO_VOTE } from '../../constants';

export function filterByDate(voti: Voto[], finish: Date, start?: Date): Voto[] {
  return voti.filter(voto => {
    const date = new Date(voto.datGiorno);
    return date <= finish && !(start && date < start);
  });
}

export function mean(voti: Voto[]): number {
  if (voti.length === 0) return NaN;
  return (
    voti.reduce(
      (sum, voto) => sum + voto.decValore,
      0 // Initial value
    ) / voti.length
  );
}

export function filterBySubject(voti: Voto[], materia: string): Voto[] {
  return voti.filter(
    voto => materia.toUpperCase() === voto.desMateria.toUpperCase()
  );
}

export function isUnreal(voto: Voto): boolean {
  return NO_VOTE.includes(voto.codVoto);
}
export function isImpr(voto: Voto): boolean {
  return IM_VOTE.includes(voto.codVoto);
}

const PROF_PREFIX = '(Prof. ';

export function getDocente(voto: Voto): Docente {
  const nomi: string[] = voto.docente // Ex. (Prof. MARIO GIUSEPPE ROSSI)
    .substring(PROF_PREFIX.length, voto.docente.length - 1) // Remove the first chars and the last ')'
    .replace(/ {1,}/g, ' ') // Remove double spaces
    .split(' ') // Split by space char
    .map(str => titleCase(str));

  const cognome = nomi.shift();

  return { nome: nomi.join(' '), cognome: cognome ? cognome : '' };
}
function titleCase(input: string): string {
  return input.length === 0
    ? ''
    : input.replace(
        /\w\S*/g,
        txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase()
      );
}
