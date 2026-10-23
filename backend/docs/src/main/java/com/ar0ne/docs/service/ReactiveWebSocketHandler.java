package com.ar0ne.docs.service;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Sinks;

@Component
public class ReactiveWebSocketHandler implements WebSocketHandler {

    private final Sinks.Many<String> sinks = Sinks.many().multicast().onBackpressureBuffer();

    private final Flux<String> flux = sinks.asFlux();

    @Override
    public Mono<Void> handle(WebSocketSession session) {
        Mono<Void> input = session.receive()
                .map(WebSocketMessage::getPayloadAsText)
                .doOnNext(sinks::tryEmitNext)
                .then();

        Mono<Void> output = session.send(flux.map(session::textMessage));

        return Mono.zip(input, output).then();
    }
}
