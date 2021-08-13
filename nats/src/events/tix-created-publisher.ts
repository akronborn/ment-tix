import { Publisher } from "./cmn-publisher";
import { TixCreatedEvent } from "./tix-created-event";
import { Subjects } from "./subjects";

export class TixCreatedPublisher extends Publisher<TixCreatedEvent> {
  readonly subject = Subjects.TixCreated;
}
