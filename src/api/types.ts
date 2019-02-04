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
