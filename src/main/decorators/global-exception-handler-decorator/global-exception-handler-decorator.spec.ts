import faker from '@faker-js/faker'
import { Controller } from '@presentation/contracts'
import { HttpResponse, ResponseEntity } from '@presentation/helpers'
import { mockHealthCheckRequest } from '@presentation/test'
import { CompositeValidator, ValidationError } from 'coffeeless-schema-validators'
import { mock, MockProxy } from 'jest-mock-extended'
import { GlobalExceptionHandlerDecorator } from './index'

describe('GlobalExceptionHandlerDecorator tests', () => {
  let sut: Controller
  let controller: MockProxy<Controller>
  let schema: MockProxy<CompositeValidator>
  let consoleErrorSpy: jest.SpyInstance
  const healthCheckRequestMocked = mockHealthCheckRequest()
  const handler = faker.random.word()
  const expectedTime = '2025-06-16T20:00:00.000Z'
  const successfulControllerResponse = ResponseEntity.ok().body(
    HttpResponse.build(expectedTime, null, '')
  )

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2025-06-16T20:00:00Z')) // freezes time
    controller = mock()
    schema = mock()
    controller.handle.mockResolvedValue(successfulControllerResponse)
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    sut = new GlobalExceptionHandlerDecorator(controller)
  })

  afterAll(() => {
    jest.clearAllMocks()
    jest.useRealTimers() // Reset after tests
  })

  test('Ensure handle returns badRequest error if controller.handle throws a ValidationError', async () => {
    const validationException = new ValidationError('email is invalid')
    controller.handle.mockRejectedValueOnce(validationException)
    const httpResponse = await sut.handle(healthCheckRequestMocked, handler, schema)
    expect(httpResponse).toEqual(
      ResponseEntity.badRequest().body(
        HttpResponse.build(expectedTime, null, validationException.message)
      )
    )
    expect(consoleErrorSpy).toHaveBeenCalledWith(validationException)
    expect(controller.handle).toHaveBeenCalledWith(healthCheckRequestMocked, handler, schema)
  })

  test('Ensure handle returns internal server error if controller.handle throws an unknown error', async () => {
    const unexpectedException = new Error('Something went wrong')
    controller.handle.mockRejectedValueOnce(unexpectedException)
    const httpResponse = await sut.handle(healthCheckRequestMocked, handler, schema)
    expect(httpResponse).toEqual(
      ResponseEntity.internalServerError().body(
        HttpResponse.build(expectedTime, null, unexpectedException.message)
      )
    )
    expect(consoleErrorSpy).toHaveBeenCalledWith(unexpectedException)
    expect(controller.handle).toHaveBeenCalledWith(healthCheckRequestMocked, handler, schema)
  })

  test('Ensure handle returns EntityResponse if controller executes successfully', async () => {
    const httpResponse = await sut.handle(healthCheckRequestMocked, handler, schema)
    expect(httpResponse).toEqual(successfulControllerResponse)
    expect(controller.handle).toHaveBeenCalledWith(healthCheckRequestMocked, handler, schema)
  })
})
