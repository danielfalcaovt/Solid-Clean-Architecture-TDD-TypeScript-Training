/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import type { addAccount, Controller, httpRequest, httpResponse, EmailValidator } from './signup/signupProtocols'
import { InvalidParamsError, MissingParamsError, PasswordsNotMatching } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: addAccount

  constructor (emailValidator: EmailValidator, addAccount: addAccount) {
    this.addAccount = addAccount
    this.emailValidator = emailValidator
  }

  handle (httpRequest: httpRequest): httpResponse {
    try {
      const requiredFields = ['email', 'name', 'password', 'confirmPassword']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamsError(field))
        }
      }

      const { name, email, password, confirmPassword } = httpRequest.body
      if (password !== confirmPassword) {
        return badRequest(new PasswordsNotMatching())
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValid) {
        return badRequest(new InvalidParamsError('email'))
      }

      this.addAccount.add({
        name,
        email,
        password
      })

      return {
        statusCode: 200,
        body: ''
      }
    } catch (err) {
      return serverError()
    }
  }
}
