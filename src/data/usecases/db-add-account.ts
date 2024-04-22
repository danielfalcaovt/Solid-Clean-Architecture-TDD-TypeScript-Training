import type { accountModel, addAccount, addAccountModel } from '../../domain'
import type { EncrypterMethod } from '../protocols/encrypter'

export class DbAddAccount implements addAccount {
  private readonly encrypterStub: EncrypterMethod

  constructor (encrypterStub: EncrypterMethod) {
    this.encrypterStub = encrypterStub
  }

  async add (account: addAccountModel): Promise<accountModel> {
    await this.encrypterStub.encrypt(account.password)
    return await new Promise(resolve => {
      resolve({
        id: 'string',
        email: 'string',
        name: 'string',
        password: 'string'
      })
    })
  }
}
