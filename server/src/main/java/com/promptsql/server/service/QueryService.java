package com.promptsql.server.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.promptsql.server.model.QueryRequest;
import com.promptsql.server.model.QueryResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.logging.Logger;

@Service
public class QueryService {

    private static final Logger LOGGER = Logger.getLogger(QueryService.class.getName());

    @Value("${GEMINI_API_KEY}")
    private String apiKey;

    private static final String GEMINI_API_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    public QueryResponse generateSQL(QueryRequest request) {
        RestTemplate restTemplate = new RestTemplate();

        String prompt = String.format(
                "Generate a MySQL query based on the following schema and instructions:\n" +
                        "Table: %s\nFields: %s\nInstructions: %s\nReturn only the SQL query.",
                request.getTableName(), request.getFields(), request.getQueryInstructions()
        );

        String requestBody = String.format(
                "{\"contents\": [{\"parts\": [{\"text\": \"%s\"}]}]}",
                prompt.replace("\n", "\\n").replace("\"", "\\\"")
        );

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        headers.set("x-goog-api-key", apiKey);

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_API_URL, entity, String.class);
            String body = response.getBody();
            LOGGER.info("Raw response from Gemini API: " + body);

            if (body == null || body.isEmpty()) {
                return new QueryResponse("","Empty response from API. Check logs.");
            }


            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(body);
            JsonNode textNode = root.at("/candidates/0/content/parts/0/text");

            if (textNode.isMissingNode() || textNode.asText().isEmpty()) {
                return new QueryResponse("","No SQL generated. Response format unexpected.");
            }

            String sql = textNode.asText().trim();
            sql = sql.replaceAll("(?s)```sql", "")
                    .replaceAll("(?s)```", "")
                    .trim();
            sql = formatSql(sql);

            return new QueryResponse(sql,"");

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            LOGGER.severe("API error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            return new QueryResponse("","API error: " + e.getStatusCode() + ". Check logs.");
        } catch (Exception e) {
            LOGGER.severe("Unexpected error: " + e.getMessage());
            return new QueryResponse("","Server error occurred. Check logs.");
        }
    }

    private String formatSql(String sql) {
        return sql
                .replaceAll("(?i)SELECT", "SELECT\n    ")
                .replaceAll("(?i)FROM", "\nFROM\n    ")
                .replaceAll("(?i)WHERE", "\nWHERE\n    ")
                .replaceAll("(?i)ORDER BY", "\nORDER BY\n    ")
                .replaceAll("(?i)GROUP BY", "\nGROUP BY\n    ")
                .replaceAll("(?i)INNER JOIN", "\nINNER JOIN\n    ")
                .replaceAll("(?i)LEFT JOIN", "\nLEFT JOIN\n    ")
                .replaceAll("(?i)RIGHT JOIN", "\nRIGHT JOIN\n    ")
                .trim();
    }

    public QueryResponse explainSQL(String sqlQuery){
        RestTemplate restTemplate = new RestTemplate();

        String prompt = String.format("Explain the following MySQL query in simple terms, step by step:\n\n%s ",sqlQuery);

        String requestBody = String.format( "{\"contents\": [{\"parts\": [{\"text\": \"%s\"}]}]}",
                prompt.replace("\n", "\\n").replace("\"", "\\\""));

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        headers.set("x-goog-api-key", apiKey);

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_API_URL, entity, String.class);
            String body = response.getBody();
            LOGGER.info("Raw response from Gemini API(explain MySQL): " + body);

            if (body == null || body.isEmpty()) {
                return new QueryResponse("","Empty response from API. Check logs.");
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(body);
            JsonNode textNode = root.at("/candidates/0/content/parts/0/text");

            if (textNode.isMissingNode() || textNode.asText().isEmpty()) {
                return new QueryResponse("","No SQL generated. Response format unexpected.");
            }

            String explanation = textNode.asText().trim();
            explanation = explanation.replaceAll("\\*\\*", "")
                    .replaceAll("`", "");


            return new QueryResponse("",explanation);

        } catch (HttpClientErrorException | HttpServerErrorException e) {
            LOGGER.severe("API error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            return new QueryResponse("","API error: " + e.getStatusCode() + ". Check logs.");
        } catch (Exception e) {
            LOGGER.severe("Unexpected error: " + e.getMessage());
            return new QueryResponse("","Server error occurred. Check logs.");
        }

    }
}

