package com.promptsql.server.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpClientErrorException.class)
    public ResponseEntity<String> handleClientError(
            HttpClientErrorException e) {

        return ResponseEntity
                .status(e.getStatusCode())
                .body("API Error: " + e.getStatusCode());
    }

    @ExceptionHandler(HttpServerErrorException.class)
    public ResponseEntity<String> handleServerError(
            HttpServerErrorException e) {

        return ResponseEntity
                .status(e.getStatusCode())
                .body("Server Error: " + e.getStatusCode());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(
            Exception e) {

        return ResponseEntity
                .internalServerError()
                .body("Something went wrong");
    }
}