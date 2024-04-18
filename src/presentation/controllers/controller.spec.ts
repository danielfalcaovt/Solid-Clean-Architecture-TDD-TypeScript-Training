/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable promise/param-names */

import { InvalidParamsError, MissingParamsError, PasswordsNotMatching, ServerError } from '../errors'
import type { EmailValidator, addAccount, addAccountModel, accountModel } from './signup/signupProtocols'
import { SignUpController } from './signup'

// TIPO DE RETORNO DA FACTORY
interface sutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: addAccount
}
// FACTORY
const makeSut = (): sutTypes => {
  // DUBLÊ DE TESTES
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccountStub()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  return emailValidatorStub
}

const makeAddAccountStub = (): addAccount => {
  class AddAccountStub implements addAccount {
    async add (account: addAccountModel): Promise<accountModel> {
      const fakeAccount: accountModel = {
        id: 'valid_id',
        name: 'valid_username',
        email: 'valid_email@gmail.com',
        password: 'valid_password'
      }
      return await new Promise((resolve) => { resolve(fakeAccount) })
    }
  }
  return new AddAccountStub()
}

describe('SignUp Controller', () => {
  test('Should return 400 Error if no name provided.', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'email@gmail.com',
        password: 'password',
        confirmPassword: 'password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('name'))
  })
  test('Should return 400 Error if no mail provided.', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'username',
        password: 'password',
        confirmPassword: 'password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('email'))
  })
  test('Should return 400 Error if no password provided.', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'username',
        email: 'email@gmail.com',
        confirmPassword: 'password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('password'))
  })
  test('Should return 400 Error if no confirm password provided.', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'username',
        email: 'email@gmail.com',
        password: 'password'
      }
    }

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('confirmPassword'))
  })
  test('Should return 400 error if passwords is not matching', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'username',
        email: 'email@gmail.com',
        password: 'password',
        confirmPassword: 'another'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new PasswordsNotMatching())
  })
  test('Should return 400 Error if mail is invalid.', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'username',
        email: 'email@gmail.com',
        password: 'password',
        confirmPassword: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamsError('email'))
  })
  test('Should call emailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const jestSpyOn = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'username',
        email: 'email@gmail.com',
        password: 'password',
        confirmPassword: 'password'
      }
    }
    await sut.handle(httpRequest)
    expect(jestSpyOn).toHaveBeenCalledWith('email@gmail.com')
  })
  test('Should return 500 if emailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'username',
        email: 'email@gmail.com',
        password: 'password',
        confirmPassword: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Should call addAccount with correct parameters', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        confirmPassword: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })
  test('Should return 500 if addAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const httpRequest = {
      body: {
        name: 'username',
        email: 'email@gmail.com',
        password: 'password',
        confirmPassword: 'password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
  test('Return 200 if account has been added with success', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'valid_username',
        email: 'valid_email@gmail.com',
        password: 'valid_password',
        confirmPassword: 'valid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_username',
      email: 'valid_email@gmail.com',
      password: 'valid_password'
    })
  })
})
