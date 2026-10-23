package com.ar0ne.docs.service;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Component
public class ReactiveWebSocketHandler implements WebSocketHandler {
    @Override
    public Mono<Void> handle(WebSocketSession session) {
        Flux<String> inboundSignal = session.receive()
                .map(WebSocketMessage::getPayloadAsText)
                .map(msg -> "{\"status\": \"ok\"}");

        Flux<WebSocketMessage> outboundSignals = inboundSignal
                .map(session::textMessage);

        return session.send(outboundSignals);
    }
}
