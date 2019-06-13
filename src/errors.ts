export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}
export class TimeoutError extends Error {
  constructor(m: string) {
    super(m);
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}
export class ServerError extends Error {
  private _obj: {};
  constructor(obj: {}) {
    super();
    this._obj = obj;
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
  get obj(): {} {
    return this._obj;
  }
}
