import type { EmailValidator } from '../presentation/protocols/emailvalidator'

export class EmailValidatorAdapter implements EmailValidator {
  isValid (email: string): boolean {
    return false
  }
}
