export interface EncrypterMethod {
  encrypt: (password: string) => Promise<string>
}
