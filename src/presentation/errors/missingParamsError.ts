/* eslint-disable @typescript-eslint/strict-boolean-expressions */
export class MissingParamsError extends Error {
  constructor (paramName: string) {
    super(`Missing param: ${paramName}`)
    this.name = 'MissingParamsError'
  }
}
