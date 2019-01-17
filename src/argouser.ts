import to from 'await-to-js'
import Axios from 'axios'
import { IArgomento, IArgoUser, ICompito, IVoto } from './api';
import {
  ARGO_API_URL,
  ARGO_DEF_HEADERS,
  IM_VOTE,
  NO_VOTE
} from './constants'


function checkRealMark(voto: any): boolean {
  return !NO_VOTE.includes(voto.codVoto)
}
function checkImpr(voto: { codVoto: any; }): boolean {
  return !IM_VOTE.includes(voto.codVoto)
}
export class ArgoUser {
  public isToken: boolean;
  public userType: any;
  public scheda: any;
  private user: IArgoUser;
  private headers: any = {};
  private authenticated = false;
  private cached: {
    cacheTime: number;
    data: any
  };
  constructor(codMin: string, username: string, password: string, isToken: boolean = false, cacheTime = 10 * 3600) {
    this.isToken = isToken
    this.user = {
      accessCode: password,
      codMin,
      scheda: {},
      username
    }

    this.cached = {
      cacheTime,
      data: {}
    }
  }

  public async authenticate(): Promise<boolean> {
    let err
    let response

    this.headers = {
      ...this.headers,
      'x-cod-min': this.user.codMin
    }
    if (!this.isToken) {
      const actualHeaders = {
        'x-pwd': this.user.accessCode,
        'x-user-id': this.user.username
      };
      [err, response] = await to(this.curl('login', actualHeaders))
      if (err || !response) { return false }

      this.userType = response.data.tipoUtente
      this.user.accessCode = response.data.token
    }

    const header = {
      'x-auth-token': this.user.accessCode
    };

    [err, response] = await to(this.curl('schede', header))
    if (err || !response) { return false; }

    [this.scheda] = response.data

    const newDefHeaders = {
      'x-prg-alunno': this.scheda.prgAlunno,
      'x-prg-scheda': this.scheda.prgScheda,
      'x-prg-scuola': this.scheda.prgScuola
    }

    this.headers = {
      ...this.headers,
      ...header,
      ...newDefHeaders
    }
    this.authenticated = true

    return this.authenticated
  }

  public async get(request: string): Promise<any> {
    if (this.cached.cacheTime !== 0) {
      const cachedRequest = this.cached.data[request];
      if (cachedRequest.data 
        && (cachedRequest.time - Date.now()) > this.cached.cacheTime) {
        return cachedRequest.data;
      }
    }
    const responseData = (await this.curl(request)).data.dati;
    this.cached.data[request].data = responseData;
    this.cached.data[request].time = Date.now();
    return responseData;
  }

  public get voti(): Promise<IVoto[]> {
    return this.get('votigiornalieri')
  }

  public get votiRaw(): Promise<number[]> {
    return this.voti.then(value => {
      return value.filter((voto: any) => (voto !== null) && checkRealMark(voto))
        .map((voto: any) => voto.decValore)
    });
  }

  public async getLowestVoto(): Promise<IVoto | undefined> {
    let votoMin;
    let minValue = 11

    const voti = await this.voti
    for (const voto of voti) {
      if (checkRealMark(voto) && (voto.decValore < minValue)) {
        votoMin = voto
        minValue = voto.decValore
      }
    }
    return votoMin
  }

  public async getHighestVoto(): Promise<IVoto | undefined> {
    let votoMax;
    let maxValue = -1;

    const voti = await this.voti
    for (const voto of voti) {
      if (checkRealMark(voto) && (voto.decValore > maxValue)) {
        votoMax = voto
        maxValue = voto.decValore
      }
    }
    return votoMax
  }

  public get materie(): Promise<Set<string>> {
    const materie = new Set<string>();

    return this.voti.then(voti => {
      voti.forEach(voto => {
        materie.add(voto.desMateria)
      });
      return materie;
    })
  }
  public get compiti(): Promise<ICompito[]> {
    return this.get('compiti');
  }
  public get token(): string {
    return this.user.accessCode;
  }
  public get argomenti(): Promise<IArgomento> {
    return this.get('argomenti');
  }
  public get username(): string {
    return this.user.username;
  }
  public get codMin(): string {
    return this.user.codMin;
  }


  private async curl(request: string, addedHeaders = {}, params = {}) {
    const fHeaders = {
      ...ARGO_DEF_HEADERS,
      ...this.headers,
      ...addedHeaders
    }
    const fParams = {
      ...params,
      _dc: Math.round((+new Date()) * 1000)
    }

    return Axios.get(ARGO_API_URL + request,
      {
        headers: fHeaders,
        params: fParams
      })
  }
}