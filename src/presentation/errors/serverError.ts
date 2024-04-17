/* eslint-disable @typescript-eslint/strict-boolean-expressions */

export class ServerError extends Error {
  constructor () {
    super('Internal Server Error.')
    this.name = 'InternalServerError'
  }
}
