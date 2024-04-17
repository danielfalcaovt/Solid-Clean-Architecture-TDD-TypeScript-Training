import { ServerError } from '../errors'
import type { httpResponse } from '../protocols/http'

export const badRequest = (error: Error): httpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (): httpResponse => ({
  statusCode: 500,
  body: new ServerError()
})
