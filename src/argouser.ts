import to from "await-to-js";
import Axios from "axios";
import {
  ApiUser,
  Compito,
  Voto,
  Argomento,
  Scheda,
  Assenza
} from "./api/types";
import { ARGO_API_URL, ARGO_DEF_HEADERS } from "./constants";
import { checkRealMark } from "./api/operators/voto-operators";

export class ArgoUser {
  isToken: boolean;
  scheda!: Scheda;
  userType!: string;
  private user: ApiUser;
  private headers: { [header: string]: string | number } = {};
  private authenticated = false;
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

  async authenticate(): Promise<boolean> {
    let err;
    let response;

    // Set headers
    this.headers = {
      ...this.headers,
      "x-cod-min": this.user.codMin
    };

    // Check for token, otherwise get it
    if (!this.isToken) {
      const actualHeaders = {
        "x-pwd": this.user.accessCode,
        "x-user-id": this.user.username
      };
      [err, response] = await to(this.curl("login", actualHeaders));
      if (err || !response) {
        return false;
      }

      this.userType = response.data.tipoUtente;
      this.user.accessCode = response.data.token;
    }

    // Create temp header with auth token
    const header = {
      "x-auth-token": this.user.accessCode
    };

    [err, response] = await to(this.curl("schede", header));
    if (err || !response) {
      return false;
    }

    [this.scheda] = response.data;

    const newDefHeaders = {
      "x-prg-alunno": this.scheda.prgAlunno,
      "x-prg-scheda": this.scheda.prgScheda,
      "x-prg-scuola": this.scheda.prgScuola
    };

    // Update instance headers
    this.headers = {
      ...this.headers,
      ...header,
      ...newDefHeaders
    };

    return (this.authenticated = true);
  }

  async get(request: string): Promise<any> {
    // Check if request has been cached before
    // Check if cache is active
    if (this.cache.maxTime !== 0) {
      const cachedRequest = this.cache.requests[request];

      // Check if cached requests exists and if it has been cached not so long ago
      if (
        cachedRequest &&
        cachedRequest.data &&
        cachedRequest.creationTime - Date.now() < this.cache.maxTime
      ) {
        return cachedRequest.data;
      }
    }

    // Make a new request
    const responseData = (await this.curl(request)).data.dati;

    // Cache request result
    this.cache.requests[request] = {
      data: responseData,
      creationTime: Date.now()
    };

    return responseData;
  }

  get voti(): Promise<Voto[]> {
    return this.get("votigiornalieri");
  }
  get votiRaw(): Promise<number[]> {
    return this.voti.then(value => {
      return value
        .filter((voto: Voto) => voto !== null && checkRealMark(voto))
        .map((voto: Voto) => voto.decValore);
    });
  }
  get votiFiltered(): Promise<Voto[]> {
    return this.voti.then(voti => {
      return voti.filter((voto: Voto) => voto !== null && checkRealMark(voto));
    });
  }

  async getLowestVoto(): Promise<Voto | null> {
    let votoMin = null;
    let minValue = 11;

    const voti = await this.voti;
    for (const voto of voti) {
      if (checkRealMark(voto) && voto.decValore < minValue) {
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
      if (checkRealMark(voto) && voto.decValore > maxValue) {
        votoMax = voto;
        maxValue = voto.decValore;
      }
    }
    return votoMax;
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
    return this.get("compiti");
  }
  get argomenti(): Promise<Argomento> {
    return this.get("argomenti");
  }
  get assenze(): Promise<Assenza> {
    return this.get("assenze");
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

  private async curl(request: string, addedHeaders = {}, params = {}) {
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
      params: fParams
    });
  }
}
