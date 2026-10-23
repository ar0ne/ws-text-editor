
export default class RealTimeClient {
    constructor(url) {
        this.url = url;
        this.socket = null;
        this.listeners = new Map();
        this.pendingSubscriptions = new Set();
    }

    connect () {
        if (this.socket &&
            (this.socket.readyState === WebSocket.OPEN || 
            this.socket.readyState === WebSocket.CONNECTING)) {
            return;
        }

        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            console.log("On open");
            for (const topic of this.listeners.keys()) {
                this.send({ type: "subscribe", topic });
            }

            this.pendingSubscriptions.clear();    
        }

        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
        
            if (message.type !== "publish") return;

            const callbacks = this.listeners.get(message.topic);

            callbacks?.forEach((callback) => {
                callback(message.data);
            });
        }

        this.socket.onclose = () => {
            console.log("On close");
            this.socket = null;
        }
    }

    publish(topic, data) {
        this.send({
            type: "publish",
            topic,
            data
        });
    }

    subscribe(topic, callback) {
        if (!this.listeners.has(topic)) {
            this.listeners.set(topic, new Set());
        }

        const callbacks = this.listeners.get(topic);
        callbacks.add(callback);

        if (callbacks.size === 1) {
            if (this.socket?.readyState === WebSocket.OPEN) {
                this.send({ type: "subscribe", topic });
            } else {
                this.pendingSubscriptions.add(topic);
                this.connect();
            }
        }

        return () => {
            callbacks.delete(callback);

            if (callbacks.size === 0) {
                this.listeners.delete(topic);
                this.pendingSubscriptions.delete(topic);

                if (this.socket?.readyState === WebSocket.OPEN) {
                    this.send({ type: "unsubscribe", topic });
                }
            }
        };
    }

    send(message) {
        if (this.socket?.readyState !== WebSocket.OPEN) {
            throw new Error("WebSocket is not connected");
        }
        this.socket.send(JSON.stringify(message));
    }

    disconnect() {
        this.socket?.close();
        this.socket = null;
    }
}
