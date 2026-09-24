import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'

export class ApiError extends Error {
  status?: number
  code?: string
  details?: unknown

  constructor(message: string, options: { status?: number, code?: string, details?: unknown } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = options.status
    this.code = options.code
    this.details = options.details
  }
}

export const httpClient = axios.create({
  baseURL: '/api',
  timeout: 15_000,
  withCredentials: true,
  headers: { Accept: 'application/json' },
})

httpClient.interceptors.response.use(
  response => response,
  (error: unknown) => {
    if (!axios.isAxiosError(error) || axios.isCancel(error))
      return Promise.reject(error)

    const responseData: unknown = error.response?.data
    const responseMessage
      = typeof responseData === 'object' && responseData !== null && 'message' in responseData
        ? responseData.message
        : undefined
    const message = typeof responseMessage === 'string'
      ? responseMessage
      : Array.isArray(responseMessage)
        ? responseMessage.filter((item): item is string => typeof item === 'string').join(', ')
        : error.message

    return Promise.reject(new ApiError(message, {
      status: error.response?.status,
      code: error.code,
      details: responseData,
    }))
  },
)

export const apiClient = {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return httpClient.get<T>(url, config).then(response => response.data)
  },
  post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T> {
    return httpClient.post<T>(url, data, config).then(response => response.data)
  },
  patch<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T> {
    return httpClient.patch<T>(url, data, config).then(response => response.data)
  },
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return httpClient.delete<T>(url, config).then(response => response.data)
  },
}
