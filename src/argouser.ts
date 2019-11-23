import Axios, { AxiosResponse, AxiosError } from 'axios';
import {
  ApiUser,
  Compito,
  Voto,
  Argomento,
  Scheda,
  Assenza,
  Ora,
  Docente,
  DocenteClasse
} from './api/types';
import { ARGO_API_URL, ARGO_DEF_HEADERS } from './constants';
import { TimeoutError, AuthError, ServerError } from './errors';

export class ArgoUser {
  isToken: boolean;
  scheda!: Scheda;
  userType!: string;
  timeOut: number = 2500;
  private user: ApiUser;
  private headers: { [header: string]: string | number } = {};

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
    // Make a new request
    return (await this.curl(request)).data;
  }

  async getVoti(): Promise<Voto[]> {
    return ((await this.get('votigiornalieri')) as any).dati;
  }

  async getDocenti(): Promise<DocenteClasse[]> {
    return this.get('docenticlasse');
  }

  async getOrario(): Promise<Ora[]> {
    return ((await this.get('orario')) as any).dati;
  }

  async getCompiti(): Promise<Compito[]> {
    return (this.get('compiti') as any).dati;
  }
  async getArgomenti(): Promise<Argomento[]> {
    return (this.get('argomenti') as any).dati;
  }
  async getAssenze(): Promise<Assenza[]> {
    return (this.get('assenze') as any).dati;
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

  async curl(
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
    }).catch((err: AxiosError) => {
      if (Axios.isCancel(err) || !err.response) {
        throw new TimeoutError('Request reached max timeout time');
      } else if (
        err.response &&
        err.response.status &&
        err.response.status === 401
      ) {
        throw new AuthError();
      } else if (
        err.response &&
        err.response.status &&
        err.response.status === 401
      ) {
        throw new ServerError(err.response.data);
      } else {
        throw err;
      }
    });
  }
}
