import { DocenteClasse } from '../../api/types';
import { titleCase } from '../voto/voto-operators';

export function getMaterie(docenteclasse: DocenteClasse): string[] {
  return docenteclasse.materie
    .substring(1, docenteclasse.materie.length - 1)
    .split(',')
    .map(materia => titleCase(materia));
}
