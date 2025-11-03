import { BaseController } from '@presentation/contracts'
import { mock, MockProxy } from 'jest-mock-extended'
import { LLMService } from '@domain/contracts/llm-service'
import { mockHealthCheckRequest } from '@presentation/test'
import { CompositeValidator } from 'coffeeless-schema-validators'
import { LLMController } from './llm-controller'
import { LLM } from '@domain/entities/llm'
import { HttpResponse, ResponseEntity } from '@presentation/helpers'

describe('ApplicationController tests', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let sut: BaseController
  let llmService: MockProxy<LLMService>
  let schema: MockProxy<CompositeValidator>
  const healthCheckRequestMocked = mockHealthCheckRequest()
  const expectedTime = '2025-06-16T20:00:00.000Z'

  beforeAll(() => {
    llmService = mock()
    schema = mock()
    schema.failFast.mockReturnValue(schema)
    sut = new LLMController(llmService)
  })

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2025-06-16T20:00:00Z')) // freezes time\
  })

  afterAll(() => {
    jest.useRealTimers() // Reset after tests
  })

  describe('checkHealth tests', () => {
    test('Ensure checkHealth returns badRequest error an exception if schema validator throws a bad request exception', async () => {
      const badRequestException = new Error('Input is invalid')
      schema.validate.mockImplementationOnce(() => {
        throw badRequestException
      })
      const promise = sut.handle(healthCheckRequestMocked, 'checkHealth', schema)
      await expect(promise).rejects.toThrow(badRequestException)
      expect(schema.validate).toHaveBeenCalledWith(healthCheckRequestMocked)
    })

    test('Ensure save throws an exception when llmService.checkHealth throws an exception', async () => {
      const nonOperationalError = new Error('Something went wrong')
      llmService.checkHealth.mockRejectedValueOnce(nonOperationalError)
      const promise = sut.handle(healthCheckRequestMocked, 'checkHealth', schema)
      await expect(promise).rejects.toThrow(nonOperationalError)
      const { company, model } = healthCheckRequestMocked
      expect(llmService.checkHealth).toHaveBeenCalledWith(
        expect.objectContaining({
          company,
          model
        })
      )
      const passedArgument = llmService.checkHealth.mock.calls[0][0]
      expect(passedArgument).toBeInstanceOf(LLM)
    })

    test("Ensure save returns ok when health check doesn't throw any errors", async () => {
      const response = await sut.handle(healthCheckRequestMocked, 'checkHealth', schema)
      expect(response).toEqual(
        ResponseEntity.ok().body(
          HttpResponse.build(expectedTime, null, 'Health check operation successfully completed.')
        )
      )
    })
  })
})
