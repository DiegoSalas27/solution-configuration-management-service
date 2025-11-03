import { contentType } from './content-type'

describe('contenType tests', () => {
  let mockRequest: any
  let mockResponse: any
  let nextFunction: any

  beforeEach(() => {
    mockRequest = jest.fn()
    mockResponse = {
      type: jest.fn()
    }
    nextFunction = jest.fn()
  })

  test('should call res.type with json string', () => {
    const response = contentType(mockRequest, mockResponse, nextFunction)
    expect(response).toBeFalsy()
    expect(mockResponse.type).toHaveBeenCalledWith('json')
    expect(nextFunction).toHaveBeenCalledTimes(1)
  })
})
