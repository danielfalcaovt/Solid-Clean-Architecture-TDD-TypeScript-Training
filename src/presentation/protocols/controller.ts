import type { httpResponse, httpRequest } from './http'

export interface Controller {
  handle: (httpRequest: httpRequest) => httpResponse
}
