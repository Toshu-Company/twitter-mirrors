import {
  CacheInterceptor as NativeCacheInterceptor,
  ExecutionContext,
} from '@nestjs/common';

export class CacheInterceptor extends NativeCacheInterceptor {
  protected override isRequestCacheable(context: ExecutionContext): boolean {
    const noCaching: boolean = this.reflector.get(
      'noCaching',
      context.getHandler(),
    );

    return !noCaching && super.isRequestCacheable(context);
  }
}
