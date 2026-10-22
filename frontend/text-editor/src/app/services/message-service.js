
import MessageQueue from "./message-queue";

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
    await sleep(1000);
    console.log("Sent");
}

export const msgQueue = new MessageQueue(sendBatch, {
    batchSize: 2,
    flushIntervalMs: 1000
});