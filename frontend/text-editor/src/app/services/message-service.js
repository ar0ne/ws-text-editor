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

class MessageService {

    constructor(url, topic, options) {
        this.url = url;
        this.topic = topic;
        this.queue = new MessageQueue(
            (msgs) => this.sendBatch(msgs), 
            options
        );
        this.realtimeClient = new RealTimeClient(url);
        this.realtimeClient.connect();
    }

    subscribeToTopic(callback) {
        this.realtimeClient.subscribe(this.topic, (msg) => {
            // here we would decode and apply if userId is not current user
            console.log("received:" + msg);
            callback(msg);
        });
    }

    handleMessage(message) {
        console.log(message);
    }

    async sendBatch(messages) {
        let userId = messages.peek().userId;
        let encodedMessages = userId + messages.map(m => encodeMessage(m))
            .join("::");
        console.log("Sending batch:", encodedMessages);
        this.realtimeClient.publish(this.topic, encodedMessages);
        console.log("Batch was send");
    }

    enqueueMessage(message) {
        if (!message) {
            return;
        }
        this.queue.enqueue(message);
    }

}

export const messageService = new MessageService(
    "ws://localhost:8080/ws", 
    "my-topic",
    {
        batchSize: 2,
        flushInterval: 1000,
    }
);