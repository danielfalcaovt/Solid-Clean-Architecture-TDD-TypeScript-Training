/* eslint-disable @typescript-eslint/strict-boolean-expressions */

export class InvalidParamsError extends Error {
  constructor (paramName: string) {
    super(`Invalid param: ${paramName}`)
    this.name = 'InvalidParamsError'
  }
}
