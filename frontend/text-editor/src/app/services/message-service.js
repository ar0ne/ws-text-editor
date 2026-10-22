
import MessageQueue from "./message-queue";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function escape(value) {
    return value
        .replaceAll("{", "\\{")
        .replaceAll("}", "\\}")
        .replaceAll(":", "\\:");
}


function dictToCustomString(message) {
  return `${message.type === 'add' ? '+' : '-'}{${message.diff
    .map(([k, v]) => `${k}:${escape(v)}`)
    .join(",")}}}`
}

async function sendBatch(messages) {
    let plainMessages = [...messages.map(m => dictToCustomString(m))];
    console.log("Sending messages:", plainMessages);
    await sleep(1000);
    console.log("Sent");

}

export const msgQueue = new MessageQueue(sendBatch, {
    batchSize: 1,
    flushIntervalMs: 500
});