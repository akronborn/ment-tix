import { Message } from "node-nats-streaming";
import { Listener } from "./cmn-listener";
import { TixCreatedEvent } from "./tix-created-event";
import { Subjects } from "./subjects";

export class TixCreatedListener extends Listener<TixCreatedEvent> {
  readonly subject = Subjects.TixCreated;
  queueGroupName = "payments-service";

  onMessage(data: TixCreatedEvent["data"], msg: Message) {
    console.log("Event data:", data);

    console.log(data.title);
    console.log(data.content);

    msg.ack();
  }
}
