import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

// FACTORY

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalidEmail@mail.com')
    expect(isValid).toBe(false)
  })
  test('Should return true if EmailValidator isValid returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('validmail@mail.com')
    expect(isValid).toBe(true)
  })
  test('Should call validator with correct value', () => {
    const sut = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('any_mail@mail.com')
    expect(isEmailSpy).toHaveBeenCalledWith('any_mail@mail.com')
  })
})
