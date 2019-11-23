import 'jasmine';
import { getMaterie } from './docente-operators';
import { DocenteClasse } from '../../api/types';

describe('Docente operators', () => {
  it('should return correct materie', () => {
    const dummy = {
      prgClasse: 1234,
      prgAnagrafe: 123,
      prgScuola: 1,
      materie: '(DUMMYLA,TESTLO)',
      docente: { nome: 'DUMMY', cognome: 'TUMMY' },
      codMin: 'DUM'
    };
    expect(getMaterie(dummy as DocenteClasse)).toEqual(['Dummyla', 'Testlo']);
  });
});
