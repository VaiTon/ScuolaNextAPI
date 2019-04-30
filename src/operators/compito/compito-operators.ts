import { Compito } from '../..';

const MATCHER = /\(Assegnati per il [0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}\)/;

export function getAssegnati(compito: Compito): string {
  if (compito.desCompiti === '') return '';

  const matched = MATCHER.exec(compito.desCompiti);

  return matched ? matched.join() : '';
}
export function filterAssegnati(compito: Compito): string {
  const assegnati = getAssegnati(compito);

  return assegnati
    ? compito.desCompiti.replace(assegnati, '')
    : compito.desCompiti;
}
