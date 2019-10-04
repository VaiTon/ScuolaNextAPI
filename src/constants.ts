export const ARGO_API_URL = 'https://www.portaleargo.it/famiglia/api/rest/';
export const ARGO_API_KEY = 'ax6542sdru3217t4eesd9';
export const ARGO_API_VERSION = '2.1.0';
export const ARGO_PRODUCER = 'ARGO Software s.r.l. - Ragusa';
export const ARGO_APP_KEY = 'APF';

export const ARGO_DEF_HEADERS = {
  'x-key-app': ARGO_API_KEY,
  'x-version': ARGO_API_VERSION,
  'x-app-code': ARGO_APP_KEY,
  'x-produttore-software': ARGO_PRODUCER
};

export const NO_VOTE = [
  'A',
  'AA',
  'AC',
  'R',
  'AL',
  'AM',
  'RI',
  'SP',
  'E',
  'I',
  'M',
  'MM',
  'N',
  'S',
  'IM'
];
export const IM_VOTE = ['IM', 'N'];
