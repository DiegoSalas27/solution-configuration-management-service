import { FallBackEvent } from '@domain/entities/fall-back-event'

export interface FallBackEventRepository {
  saveFallBackEvent: (fallBackEvent: FallBackEvent) => FallBackEvent
}
