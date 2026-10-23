
export default class RealTimeClient {
    constructor(url, handleMessage) {
        this.url = url;
        this.handleMessage = handleMessage;
        this.socket = null;
    }

    connect () {
        if (this.socket?.readyState === WebSocket.OPEN) {
            return;
        }

        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            console.log("On open");
        }

        this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
        }

        this.socket.onclose = () => {
            console.log("On close");
        }
    }

    publish(topic, data) {
        if (this.socket?.readyState !== WebSocket.OPEN) {
            throw new Error("WebSocket is not connected");
        }

        this.socket.send(JSON.stringify({
            type: "publish",
            topic,
            data
        }));
    }

    subscribe(topic) {
        this.socket?.send(JSON.stringify({
            type: "subscribe",
            topic,
        }));
    }

    disconnect() {
        this.socket?.close();
        this.socket = null;
    }
}
