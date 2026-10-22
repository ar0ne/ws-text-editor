
import { Queue } from "data-structure-typed";

export default class MessageQueue {

    constructor(sendBatch, options = {}) {
        this.sendBatch = sendBatch;
        this.batchSize = options.batchSize ?? 5;
        this.flushIntervalMs = options.flushIntervalMs ?? 1000;

        this.queue = new Queue();
        this.timer = null;
        this.flushing = false;
        this.retryAttempt = 0;
    }

    enqueue(message) {
        console.log("enqueue message: ", message);
        this.queue.push(message);

        if (this.queue.length >= this.batchSize) {
            void this.flush();
        } else {
            this.sceduleFlush();
        }
    }

    async flush() {
        console.log("flushing...")
        if (this.flushing || this.queue.isEmpty()) {
            return;
        }

        this.flushing = true;
        const batch = this.queue.splice(0, this.batchSize);

        try {
            await this.sendBatch(batch);
            this.retryAttempt = 0;
        } catch(error) {
            this.queue.splice(0, 0, ...batch);
            this.retryAttempt++;

            const backOff = Math.min(
                1000 * 2 * (this.retryAttempt - 1),
                30000
            );

            const jitteredDelay = backOff * (0.5 + Math.random());

            console.error("Failed to send message batch: ", error);
            this.sceduleFlush(jitteredDelay);
        } finally {
            this.flushing = false;

            if (!this.queue.isEmpty() && !this.timer) {
                this.sceduleFlush(
                    this.queue.length >= this.batchSize
                    ? 0
                    : this.flushIntervalMs
                );
            }
        }
    }

    sceduleFlush(delay = this.flushIntervalMs) {
        if (this.timer) {
            clearTimeout(this.timer);
        }

        this.timer = setTimeout(() => {
            this.timer = null;
            void this.flush();
        }, delay);
    }


    get pendingCount() {
        return this.queue.length;
    }


    destroy() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }


}