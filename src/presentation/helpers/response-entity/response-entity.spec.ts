import faker from '@faker-js/faker'
import { HttpResponse, ResponseEntity } from '@presentation/helpers'

describe('ResponseEntity tests', () => {
  const httpResponse = faker.datatype.json()
  const responseTime = '2025-06-16T20:00:00.000Z'
  const message = 'Unauthorized'
  const response = HttpResponse.build(responseTime, httpResponse, message)

  test('Ensure ResponseEntity an entity response with 200 status code', () => {
    const responseEntity = ResponseEntity.ok().body(response)
    expect(responseEntity.statusCode()).toBe(200)
    expect(responseEntity.getHttpResponseBody()).toEqual(response)
  })

  test('Ensure ResponseEntity an entity response with 400 status code', () => {
    const responseEntity = ResponseEntity.badRequest().body(response)
    expect(responseEntity.statusCode()).toBe(400)
    expect(responseEntity.getHttpResponseBody()).toEqual(response)
  })

  test('Ensure ResponseEntity an entity response with 500 status code', () => {
    const responseEntity = ResponseEntity.internalServerError().body(response)
    expect(responseEntity.statusCode()).toBe(500)
    expect(responseEntity.getHttpResponseBody()).toEqual(response)
  })

  test('Ensure ResponseEntity an entity response with 204 status code', () => {
    const responseEntity = ResponseEntity.noContent().body(response)
    expect(responseEntity.statusCode()).toBe(204)
    expect(responseEntity.getHttpResponseBody()).toEqual(response)
  })

  test('Ensure ResponseEntity an entity response with 404 status code', () => {
    const responseEntity = ResponseEntity.notFound().body(response)
    expect(responseEntity.statusCode()).toBe(404)
    expect(responseEntity.getHttpResponseBody()).toEqual(response)
  })

  test('Ensure ResponseEntity an entity response with 403 status code', () => {
    const responseEntity = ResponseEntity.forbidden().body(response)
    expect(responseEntity.statusCode()).toBe(403)
    expect(responseEntity.getHttpResponseBody()).toEqual(response)
  })

  test('Ensure ResponseEntity an entity response with 401 status code', () => {
    const responseEntity = ResponseEntity.unauthorized().body(response)
    expect(responseEntity.statusCode()).toBe(401)
    expect(responseEntity.getHttpResponseBody()).toEqual(response)
  })
})
