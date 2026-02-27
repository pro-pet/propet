import { CallHandler, ExecutionContext, Injectable, NestInterceptor, SetMetadata } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { map, Observable } from 'rxjs'

export const SKIP_TRANSFORM_KEY = 'skipTransform'
export const SkipTransform = () => SetMetadata(SKIP_TRANSFORM_KEY, true)

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T> | T> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T> | T> {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_TRANSFORM_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (skip) {
      return next.handle()
    }

    const statusCode = context.switchToHttp().getResponse().statusCode

    return next.handle().pipe(
      map(data => ({
        code: statusCode,
        message: 'success',
        data,
      })),
    )
  }
}
