/* eslint-disable @typescript-eslint/return-await */

import type { EncrypterMethod } from '../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

interface sutTypes {
  sut: DbAddAccount
  encrypterStub: EncrypterMethod
}

// FACTORY
const makeSut = (): sutTypes => {
  class EncrypterStub implements EncrypterMethod {
    async encrypt (password: string): Promise<string> {
      return new Promise(resolve => { resolve('hashedPassword') })
    }
  }
  const encrypterStub = new EncrypterStub()
  const sut = new DbAddAccount(encrypterStub)

  return {
    sut,
    encrypterStub
  }
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
})
