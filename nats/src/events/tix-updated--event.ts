import { Subjects } from "./subjects";

export interface TixUpdatedEvent {
  subject: Subjects.TixUpdated;
  data: {
    id: string;
    instance: number;
    title: string;
    content: string;
    price: number;
    userId: string;
    orderId?: string;
  };
}
