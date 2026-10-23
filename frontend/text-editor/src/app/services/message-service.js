
import MessageQueue from "./message-queue";
import RealTimeClient from "./realtime-client";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function escape(value) {
    return value
        .replaceAll("{", "\\{")
        .replaceAll("}", "\\}")
        .replaceAll(":", "\\:")
        .replaceAll(",", "\\,");
}

function encodeMessage(message) {
  return `${message.type === 'add' ? '+' : '-'}{${message.diff
    .map(([k, v]) => `${k}:${escape(v)}`)
    .join(",")}}}`
}

async function sendBatch(messages) {
    let encodedMessages = messages.map(m => encodeMessage(m)).join("::");
    console.log("Sending messages:", encodedMessages);
    // await sleep(1000);
    realtimeClient.publish("foo", encodedMessages);
    console.log("Sent");
}

export const messageQueue = new MessageQueue(sendBatch, {
    batchSize: 2,
    flushIntervalMs: 1000
});

export const realtimeClient = new RealTimeClient(
    "ws://localhost:8080/ws",
    (message) => console.log(message)
);

realtimeClient.connect();

