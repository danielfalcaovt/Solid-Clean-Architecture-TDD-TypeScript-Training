import type { accountModel } from '../models/account'

export interface addAccount {
  add: (account: addAccountModel) => Promise<accountModel>
}

export interface addAccountModel {
  email: string
  name: string
  password: string
}
