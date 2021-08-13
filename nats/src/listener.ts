import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TixCreatedListener } from "./events/tix-created-listener";

console.clear();

const stan = nats.connect("ment-tix", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("Nats connection closed");
    process.exit();
  });

  new TixCreatedListener(stan).listen();
});
