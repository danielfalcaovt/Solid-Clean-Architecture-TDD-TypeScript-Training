import type { accountModel } from '../models/account'

export interface addAccount {
  add: (account: addAccountModel) => accountModel
}

export interface addAccountModel {
  email: string
  name: string
  password: string
}
