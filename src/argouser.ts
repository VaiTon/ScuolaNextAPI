import Axios, { AxiosPromise, AxiosResponse } from 'axios';
import {
  ApiUser,
  Compito,
  Voto,
  Argomento,
  Scheda,
  Assenza,
  Ora,
  Docente
} from './api/types';
import { ARGO_API_URL, ARGO_DEF_HEADERS } from './constants';
import { TimeoutError, AuthError } from './errors';
import { isUnreal } from './operators/voto/voto-operators';

export class ArgoUser {
  isToken: boolean;
  scheda!: Scheda;
  userType!: string;
  timeOut: number = 2500;
  private user: ApiUser;
  private headers: { [header: string]: string | number } = {};
  private cache: {
    maxTime: number;
    requests: {
      [request: string]: {
        data: string;
        creationTime: number;
      };
    };
  };
  constructor(
    codMin: string,
    username: string,
    password: string,
    isToken = false,
    cacheTime = 10 * 3600
  ) {
    this.isToken = isToken;
    this.user = {
      accessCode: password,
      codMin,
      scheda: {},
      username
    };

    this.cache = {
      maxTime: cacheTime,
      requests: {}
    };
  }
  async authenticate(): Promise<ArgoUser> {
    // Set headers
    this.headers = {
      ...this.headers,
      'x-cod-min': this.user.codMin
    };

    // Check for token, otherwise get it
    if (!this.isToken) {
      const actualHeaders = {
        'x-pwd': this.user.accessCode,
        'x-user-id': this.user.username
      };
      const response = await this.curl('login', actualHeaders);

      this.userType = response.data.tipoUtente;
      this.user.accessCode = response.data.token;
    }

    // Create temp header with auth token
    const header = {
      'x-auth-token': this.user.accessCode
    };

    this.scheda = (await this.curl('schede', header)).data[0];

    const newDefHeaders = {
      'x-prg-alunno': this.scheda.prgAlunno,
      'x-prg-scheda': this.scheda.prgScheda,
      'x-prg-scuola': this.scheda.prgScuola
    };

    // Update instance headers
    this.headers = {
      ...this.headers,
      ...header,
      ...newDefHeaders
    };

    return this;
  }

  async get(request: string) {
    // Check if request has been cached before
    // Check if cache is active
    if (this.cache.maxTime !== 0) {
      const cachedRequest = this.cache.requests[request];

      // Check if cached requests exists and if it has been cached not so long ago
      if (
        cachedRequest && // It exists
        cachedRequest.data && // It has been completed
        Date.now() - cachedRequest.creationTime < this.cache.maxTime // It has been created before max time
      ) {
        return cachedRequest.data;
      }
    }

    // Make a new request
    const response = await this.curl(request);
    const responseData = response.data.dati;

    // Cache request result
    this.cache.requests[request] = {
      data: responseData,
      creationTime: Date.now()
    };

    return responseData;
  }

  get voti(): Promise<Voto[]> {
    return this.get('votigiornalieri');
  }
  get votiRaw(): Promise<number[]> {
    return this.voti.then(value => {
      return value
        .filter((voto: Voto) => voto !== null && !isUnreal(voto))
        .map((voto: Voto) => voto.decValore);
    });
  }
  get votiFiltered(): Promise<Voto[]> {
    return this.voti.then(voti => {
      return voti.filter((voto: Voto) => voto !== null && !isUnreal(voto));
    });
  }

  async getLowestVoto(): Promise<Voto | null> {
    let votoMin = null;
    let minValue = 11;

    const voti = await this.voti;
    for (const voto of voti) {
      if (!isUnreal(voto) && voto.decValore < minValue) {
        votoMin = voto;
        minValue = voto.decValore;
      }
    }
    return votoMin;
  }

  async getHighestVoto(): Promise<Voto | null> {
    let votoMax = null;
    let maxValue = -1;

    const voti = await this.voti;
    for (const voto of voti) {
      if (!isUnreal(voto) && voto.decValore > maxValue) {
        votoMax = voto;
        maxValue = voto.decValore;
      }
    }
    return votoMax;
  }
  get docenti(): Promise<Docente[]> {
    return this.get('docenticlasse');
  }

  get orario(): Promise<Ora[]> {
    return this.get('orario');
  }

  get materie(): Promise<Set<string>> {
    return this.voti.then(voti => {
      const materie = new Set<string>();

      voti.forEach(voto => {
        materie.add(voto.desMateria);
      });

      return materie;
    });
  }
  get compiti(): Promise<Compito[]> {
    return this.get('compiti');
  }
  get argomenti(): Promise<Argomento[]> {
    return this.get('argomenti');
  }
  get assenze(): Promise<Assenza[]> {
    return this.get('assenze');
  }
  get token(): string {
    return this.user.accessCode;
  }
  get username(): string {
    return this.user.username;
  }
  get codMin(): string {
    return this.user.codMin;
  }

  private async curl(
    request: string,
    addedHeaders = {},
    params = {}
  ): Promise<AxiosResponse> {
    const fHeaders = {
      ...ARGO_DEF_HEADERS,
      ...this.headers,
      ...addedHeaders
    };
    const fParams = {
      ...params,
      _dc: Math.round(+new Date() * 1000)
    };

    return Axios.get(ARGO_API_URL + request, {
      headers: fHeaders,
      params: fParams,
      timeout: 2500
    }).catch(err => {
      if (Axios.isCancel(err) || !err.response) {
        throw new TimeoutError('Request reached max timeout time');
      } else if (
        err.response &&
        err.response.status &&
        err.response.status === 401
      ) {
        throw new AuthError('Invalid credentials');
      } else {
        throw err;
      }
    });
  }
}
