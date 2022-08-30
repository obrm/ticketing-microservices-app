import { Publisher, Subjects, TicketCreatedEvent } from '@obrmtikets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated
}
