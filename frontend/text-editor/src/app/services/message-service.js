
import MessageQueue from "./message-queue";
import { userIdentityService } from "./mock-user-service";
import RealTimeClient from "./realtime-client";


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const userId = userIdentityService.getUserId();

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

class MessageService {

    constructor(url, options) {
        this.url = url;
        this.queue = new MessageQueue((msgs) => this.sendBatch(userId, msgs), options);
        this.realtimeClient = new RealTimeClient(url, (msg) => this.handleMessage(msg));
        this.realtimeClient.connect();
    }

    subscribeToTopic(topic) {
        this.realtimeClient.subscribe(topic);
    }

    handleMessage(message) {
        console.log(message);
    }

    async sendBatch(userId, messages) {
        let encodedMessages = userId + "::" + messages.map(m => encodeMessage(m))
            .join("::");
        console.log("Sending messages:", encodedMessages);
        // await sleep(1000);
        this.realtimeClient.publish("foo", encodedMessages);
        console.log("Sent");
    }

    enqueueMessage(message) {
        if (!message) {
            return;
        }
        this.queue.enqueue(message);
    }

}

export const messageService = new MessageService(
    "ws://localhost:8080/ws", {
        batchSize: 2,
        flushInterval: 1000,
    }
);