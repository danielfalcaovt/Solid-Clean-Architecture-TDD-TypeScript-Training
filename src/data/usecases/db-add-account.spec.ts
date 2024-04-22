/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/return-await */

import type { EncrypterMethod } from '../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

interface sutTypes {
  sut: DbAddAccount
  encrypterStub: EncrypterMethod
}

// FACTORY
const makeSut = (): sutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAccount(encrypterStub)

  return {
    sut,
    encrypterStub
  }
}

const makeEncrypter = (): EncrypterMethod => {
  class EncrypterStub implements EncrypterMethod {
    async encrypt (password: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new EncrypterStub()
}

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith(accountData.password)
  })
  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid_name',
      email: 'valid@mail.com',
      password: 'valid_password'
    }
    const accountPromise = sut.add(accountData)
    // o encriptador foi mockado para retornar um erro
    // então meu teste espera que o system under test retorne um erro também.
    await expect(accountPromise).rejects.toThrow()
  })
})
