import 'jasmine';
import { getAssegnati, filterAssegnati } from './compito-operators';
import { Compito } from '../../api/types';

describe('Compito operators', () => {
  const str = '(Assegnati per il 01/02/3004)';
  const rand = [...Array(10)]
    .map(_ => ((Math.random() * 36) | 0).toString(36))
    .join();
  const fakeCompito = {
    desCompiti: str + rand
  } as Compito;

  it("should return correctly 'assegnati'", () => {
    expect(getAssegnati(fakeCompito)).toBe(str);
  });

  it("should filter correctly 'assegnati'", () => {
    expect(filterAssegnati(fakeCompito)).toBe(rand);
  });
});
