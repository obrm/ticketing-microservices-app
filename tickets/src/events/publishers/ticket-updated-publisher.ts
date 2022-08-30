import { Publisher, Subjects, TicketUpdatedEvent } from '@obrmtikets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}
