import type { ApiResponse } from '../interceptors/transform.interceptor'
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Response } from 'express'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR

    const message = this.extractMessage(exception)

    if (!(exception instanceof HttpException)) {
      this.logger.error(`Unexpected exception: ${message}`, (exception as Error)?.stack)
    }

    const body: ApiResponse<null> = {
      code: status,
      message: Array.isArray(message) ? message[0] : message,
      data: null,
    }

    response.status(status).json(body)
  }

  private extractMessage(exception: unknown): string | string[] {
    if (exception instanceof HttpException) {
      const res = exception.getResponse()

      if (typeof res === 'string')
        return res

      return (res as Record<string, unknown>)?.message as string | string[] || exception.message
    }

    return 'Internal server error'
  }
}
