import { Subjects } from './subjects';

export interface TixCreatedEvent {
  subject: Subjects.TixCreated;
  data: {
    id: string;
    instance: number;
    title: string;
    content: string;
    price: number;
    userId: string;
  };
}
