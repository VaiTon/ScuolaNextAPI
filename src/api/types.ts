export interface Argomento {
  datGiorno: string;
  desMateria: string;
  numAnno: number;
  prgMateria: number;
  prgClasse: number;
  prgScuola: number;
  desArgomento: string;
  docente: string;
  codMin: string;
}
export interface Compito {
  datGiorno: string;
  desMateria: string;
  numAnno: number;
  prgMateria: number;
  prgClasse: number;
  desCompiti: string;
  prgScuola: number;
  docente: string;
  codMin: string;
}
export interface ApiUser {
  codMin: string;
  username: string;
  accessCode: string;
  scheda: {};
}
export interface Voto {
  codMin: string;
  codVoto: string;
  codVotoPratico: string;
  datGiorno: string;
  decValore: number;
  desCommento: string;
  desMateria: string;
  desProva: string;
  docente: string;
  numAnno: number;
  prgAlunno: number;
  prgMateria: number;
  prgScheda: number;
  prgScuola: number;
}
export interface Scheda {
  schedaSelezionata: boolean;
  desScuola: string;
  prgScuola: number;
  prgScheda: number;
  desSede: string;
  authToken: string;
  alunno: {
    /** Codice fiscale */
    desCf: string;
    /** Cognome */
    desCognome: string;
    /** Indirizzo residenza */
    desVia: string;
    /** CAP */
    desCap: string;
    /** Nome. Può essere separato da spazi. */
    desNome: string;
    /** Numero di cellulare associato */
    desCellulare: null | number;
    /** Comune di nascita */
    desComuneNascita: string;
    /** Sesso (M o F) */
    flgSesso: "M" | "F";
    /** Data di nascita (Anno-Mese-Giorno) */
    datNascita: string;
    /** Indirizzo recapito */
    desIndirizzoRecapito: string;
    /** Comune recapito */
    desComuneRecapito: string;
    /** CAP residenza */
    desCapResidenza: string;
    /** Comune residenza */
    desComuneResidenza: string;
    /** Telefono associato */
    desTelefono: string;
    /** Cittadinanza studente */
    desCittadinanza: string;
  };
  /** Codice scuola */
  codMin: "SS28357";
  /** Anno scolastico */
  numAnno: 2018;
  /** Codice alunno */
  prgAlunno: 6498;
  /** Codice classe */
  prgClasse: 1925;
  /** Classe alunno (1,3,5) */
  desDenominazione: "3";
  /** Sezione alunno */
  desCorso: string;
  /** Oggetto contenente le variabili corrispondendi ai permessi dell'utente */
  abilitazioni: {
    ORARIO_SCOLASTICO: boolean;
    VALUTAZIONI_PERIODICHE: boolean;
    COMPITI_ASSEGNATI: boolean;
    TABELLONE_SCRUTINIO_FINALE: boolean;
    CURRICULUM_VISUALIZZA_FAMIGLIA: boolean;
    CONSIGLIO_DI_ISTITUTO: boolean;
    NOTE_DISCIPLINARI: boolean;
    ACCESSO_CON_CONTROLLO_SCHEDA: boolean;
    VOTI_GIUDIZI: boolean;
    VALUTAZIONI_GIORNALIERE: boolean;
    IGNORA_OPZIONE_VOTI_DOCENTI: boolean;
    ARGOMENTI_LEZIONE: boolean;
    CONSIGLIO_DI_CLASSE: boolean;
    VALUTAZIONI_SOSPESE_PERIODICHE: boolean;
    PIN_VOTI: boolean;
    PAGELLE_ONLINE: boolean;
    RECUPERO_DEBITO_INT: boolean;
    RECUPERO_DEBITO_SF: boolean;
    PROMEMORIA_CLASSE: boolean;
    VISUALIZZA_BACHECA_PUBBLICA: boolean;
    CURRICULUM_MODIFICA_FAMIGLIA: boolean;
    TABELLONE_PERIODI_INTERMEDI: boolean;
    TASSE_SCOLASTICHE: boolean;
    DOCENTI_CLASSE: boolean;
    VISUALIZZA_ASSENZE_REG_PROF: boolean;
    VISUALIZZA_CURRICULUM: boolean;
    ASSENZE_PER_DATA: boolean;
    RICHIESTA_CERTIFICATI: boolean;
    ACCESSO_SENZA_CONTROLLO: boolean;
    PRENOTAZIONE_ALUNNI: boolean;
    MODIFICA_RECAPITI: boolean;
    PAGELLINO_ONLINE: boolean;
    MEDIA_PESATA: boolean;
    GIUSTIFICAZIONI_ASSENZE: boolean;
  };
  annoScolastico: {
    datInizio: string;
    datFine: string;
  };
}
export interface Assenza {
  numOra: number | null;
  codEvento: string;
  datAssenza: string;
  prgAlunno: number;
  numAnno: number;
  flgDaGiustificare: boolean;
  prgScheda: number;
  prgScuola: number;
  desAssenza: string;
  binUid: string;
  oraAssenza: string;
  registrataDa: string;
  datGiustificazione?: string;
  codMin: string;
}
