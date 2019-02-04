import to from 'await-to-js';
import Axios from 'axios';
import { ApiUser, Compito, Voto, Argomento } from './api/types';
import {
  ARGO_API_URL,
  ARGO_DEF_HEADERS
} from './constants';
import { checkRealMark } from './api/operators/voto-operators';

export class ArgoUser {
  isToken: boolean;
  scheda: any;
  private user: ApiUser;
  private headers: { [header: string]: string } = {};
  private authenticated = false;
  private cached: {
    cacheTime: number;
    data: any
  };
  userType: any;
  constructor(codMin: string, username: string, password: string, isToken = false, cacheTime = 10 * 3600) {
    this.isToken = isToken;
    this.user = {
      accessCode: password,
      codMin,
      scheda: {},
      username
    };

    this.cached = {
      cacheTime,
      data: {}
    };
  }

  async authenticate(): Promise<boolean> {
    let err;
    let response;

    this.headers = {
      ...this.headers,
      'x-cod-min': this.user.codMin
    };
    if (!this.isToken) {
      const actualHeaders = {
        'x-pwd': this.user.accessCode,
        'x-user-id': this.user.username
      };
      [err, response] = await to(this.curl('login', actualHeaders));
      if (err || !response) { return false; }

      this.userType = response.data.tipoUtente;
      this.user.accessCode = response.data.token;
    }

    const header = {
      'x-auth-token': this.user.accessCode
    };

    [err, response] = await to(this.curl('schede', header));
    if (err || !response) { return false; }

    [this.scheda] = response.data;

    const newDefHeaders = {
      'x-prg-alunno': this.scheda.prgAlunno,
      'x-prg-scheda': this.scheda.prgScheda,
      'x-prg-scuola': this.scheda.prgScuola
    };

    this.headers = {
      ...this.headers,
      ...header,
      ...newDefHeaders
    };
    this.authenticated = true;

    return this.authenticated;
  }

  async get(request: string): Promise<any> {
    if (this.cached.cacheTime !== 0) {
      const cachedRequest = this.cached.data[request];
      if (cachedRequest && cachedRequest.data
        && (cachedRequest.time - Date.now()) > this.cached.cacheTime) {
        return cachedRequest.data;
      }
    }
    const responseData = (await this.curl(request)).data.dati;
    const cacheData: { data: string, time: number } = {
      data: responseData,
      time: Date.now()
    };
    this.cached.data[request] = cacheData;
    return responseData;
  }

  get voti(): Promise<Voto[]> {
    return this.get('votigiornalieri');
  }

  get votiRaw(): Promise<number[]> {
    return this.voti.then(value => {
      return value.filter((voto: Voto) => (voto !== null) && checkRealMark(voto))
        .map((voto: Voto) => voto.decValore);
    });
  }

  async getLowestVoto(): Promise<Voto | undefined> {
    let votoMin;
    let minValue = 11;

    const voti = await this.voti;
    for (const voto of voti) {
      if (checkRealMark(voto) && (voto.decValore < minValue)) {
        votoMin = voto;
        minValue = voto.decValore;
      }
    }
    return votoMin;
  }

  async getHighestVoto(): Promise<Voto | undefined> {
    let votoMax;
    let maxValue = -1;

    const voti = await this.voti;
    for (const voto of voti) {
      if (checkRealMark(voto) && (voto.decValore > maxValue)) {
        votoMax = voto;
        maxValue = voto.decValore;
      }
    }
    return votoMax;
  }

  get materie(): Promise<Set<string>> {
    const materie = new Set<string>();

    return this.voti.then(voti => {
      voti.forEach(voto => {
        materie.add(voto.desMateria);
      });
      return materie;
    });
  }
  get compiti(): Promise<Compito[]> {
    return this.get('compiti');
  }
  get token(): string {
    return this.user.accessCode;
  }
  get argomenti(): Promise<Argomento> {
    return this.get('argomenti');
  }
  get username(): string {
    return this.user.username;
  }
  get codMin(): string {
    return this.user.codMin;
  }


  private async curl(request: string, addedHeaders = {}, params = {}) {
    const fHeaders = {
      ...ARGO_DEF_HEADERS,
      ...this.headers,
      ...addedHeaders
    };
    const fParams = {
      ...params,
      _dc: Math.round((+new Date()) * 1000)
    };

    return Axios.get(ARGO_API_URL + request,
      {
        headers: fHeaders,
        params: fParams
      });
  }
}