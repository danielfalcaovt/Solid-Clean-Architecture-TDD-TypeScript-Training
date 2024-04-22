import { EmailValidatorAdapter } from './email-validator'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalidEmail@mail.com')
    expect(isValid).toBe(false)
  })
  test('Should return true if EmailValidator isValid returns true', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('validmail@mail.com')
    expect(isValid).toBe(true)
  })
  test('Should call validator with correct value', () => {
    const sut = new EmailValidatorAdapter()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('any_mail@mail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any_mail@mail.com')
  })
})
