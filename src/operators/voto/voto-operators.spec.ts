import 'jasmine';
import {
  getDocente,
  mean,
  filterByDate,
  filterBySubject,
  checkImpr
} from './voto-operators';
import { Voto } from '../../api/types';

describe('Voto operators', () => {
  it('should return correct docente', () => {
    const fakeVoto = {
      docente: '(Prof. VENTURA Maria BOY)'
    };
    expect(getDocente(fakeVoto as Voto)).toEqual({
      nome: ['Maria', 'Boy'],
      cognome: 'Ventura'
    });
  });

  it('should calculate correct mean', () => {
    const fakeVoti = [
      {
        decValore: 2
      },
      {
        decValore: 10
      }
    ];
    expect(mean((fakeVoti as unknown) as Voto[])).toEqual(6);
    expect(mean([])).toEqual(NaN);
  });

  it('should filter by date correctly', () => {
    const voto1 = { datGiorno: '1998-12-20' } as Voto;
    const voto2 = { datGiorno: '1998-11-20' } as Voto;
    const voto3 = { datGiorno: '1998-12-23' } as Voto;
    expect(
      filterByDate(
        [voto1, voto2, voto3],
        new Date('1998-12-20'),
        new Date('1998-11-21')
      )
    ).toEqual([voto1]);
  });

  it('should filter by subject correctly', () => {
    const votoOk = { desMateria: 'DUMMYOK' } as Voto;
    const votoNo = { desMateria: 'DUMMYNO' } as Voto;
    expect(filterBySubject([votoNo, votoOk], votoOk.desMateria)).toEqual([
      votoOk
    ]);
  });

  it("should check if the mark is 'impreparato' correctly", () => {
    const badVoti = [
      {
        codVoto: 'N'
      },
      { codVoto: 'IM' }
    ] as Voto[];
    const goodVoto = { codVoto: '9' } as Voto;

    badVoti.forEach(voto => expect(checkImpr(voto)).toBe(false));
    expect(checkImpr(goodVoto)).toBe(true);
  });
  it('should check if the mark is real correctly', () => {
    // TODO
  });
});
