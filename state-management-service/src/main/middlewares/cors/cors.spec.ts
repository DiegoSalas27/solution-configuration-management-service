import { cors } from './cors'

describe('cors tests', () => {
  let mockRequest: any
  let mockResponse: any
  let nextFunction: any

  beforeEach(() => {
    mockRequest = jest.fn()
    mockResponse = {
      set: jest.fn()
    }
    nextFunction = jest.fn()
  })

  test('should call res.set is called with the right parameters', () => {
    const response = cors(mockRequest, mockResponse, nextFunction)
    expect(response).toBeFalsy()
    expect(mockResponse.set).toHaveBeenCalledWith('access-control-allow-origin', '*')
    expect(mockResponse.set).toHaveBeenCalledWith('access-control-allow-headers', '*')
    expect(mockResponse.set).toHaveBeenCalledWith('access-control-allow-methods', '*')
    expect(nextFunction).toHaveBeenCalledTimes(1)
  })
})
