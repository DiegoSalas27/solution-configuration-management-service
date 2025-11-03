import faker from '@faker-js/faker'
import { HttpResponse } from '@presentation/helpers'

describe('HttpResponse tests', () => {
  const httpResponse = faker.datatype.json()
  const responseTime = '2025-06-16T20:00:00.000Z'
  const message = 'Unauthorized'
  const reason = faker.random.words()
  const developerMessage = faker.random.words()

  test('Ensure build returns a client response populating body, message, and timestamp', () => {
    const response = HttpResponse.build(responseTime, httpResponse, message)
    expect(response.getBody()).toEqual(httpResponse)
    expect(response.getMessage()).toBe(message)
    expect(response.getTimeStamp()).toBe(responseTime)
    expect(response.getReason()).toBe(undefined)
    expect(response.getDeveloperMessage()).toBe(undefined)
  })

  test(`Ensure build returns a developer response populating body, message, timestamp, reason, 
    and developerMessage`, () => {
    const response = HttpResponse.build(
      responseTime,
      httpResponse,
      message,
      reason,
      developerMessage
    )
    expect(response.getBody()).toEqual(httpResponse)
    expect(response.getMessage()).toBe(message)
    expect(response.getTimeStamp()).toBe(responseTime)
    expect(response.getReason()).toBe(reason)
    expect(response.getDeveloperMessage()).toBe(developerMessage)
  })
})
