import nats from "node-nats-streaming";
import { TixCreatedPublisher } from "./events/tix-created-publisher";

console.clear();

const stan = nats.connect("ment-tix", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const publisher = new TixCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: "456",
      title: "new title",
      content: "here comes the content",
      price: 60,
      userId: "789",
    });
  } catch (err) {
    console.log(err);
  }

  // const data = JSON.stringify({
  //   id: "123",
  //   title: "concert",
  //   content: "description",
  //   price: 20,
  // });

  // stan.publish("tix:created", data, () => {
  //   console.log("Event published");
  // });
});
