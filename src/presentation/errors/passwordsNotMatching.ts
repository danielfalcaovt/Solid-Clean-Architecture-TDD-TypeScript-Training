/* eslint-disable @typescript-eslint/strict-boolean-expressions */
export class PasswordsNotMatching extends Error {
  constructor () {
    super('Passwords not matching')
    this.name = 'PasswordsNotMatching'
  }
}
