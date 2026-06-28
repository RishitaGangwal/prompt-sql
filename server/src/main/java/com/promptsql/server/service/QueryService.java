package com.promptsql.server.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.promptsql.server.model.OptimizeResponse;
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

import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class QueryService {

    private static final Logger LOGGER = Logger.getLogger(QueryService.class.getName());

    @Value("${GEMINI_API_KEY}")
    private String apiKey;

    private static final String GEMINI_API_URL =
//            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    public QueryResponse generateSQL(QueryRequest request) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();

        String prompt = String.format("""
                        Generate a MySQL query.

                        Schema:
                        Table: %s
                        Schema: %s

                        Requirement:
                        %s

                        Return ONLY valid JSON:

                        {
                          "sql":"...",
                          "difficulty":"Easy/Medium/Hard",
                          "queryType":"SELECT/JOIN/GROUP BY/Aggregation"
                        }
                        """,
                request.getTableName(),
                request.getSchema(),
                request.getQueryInstructions()
        );

        String requestBody = String.format(
                "{\"contents\": [{\"parts\": [{\"text\": \"%s\"}]}]}",
                prompt.replace("\n", "\\n").replace("\"", "\\\"")
        );

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        headers.set("x-goog-api-key", apiKey);

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);


        ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_API_URL, entity, String.class);
        String body = response.getBody();
        LOGGER.info("Raw response from Gemini API: " + body);

        if (body == null || body.isEmpty()) {
            throw new RuntimeException("Empty response from Gemini");
        }


        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(body);
        JsonNode textNode = root.at("/candidates/0/content/parts/0/text");

        if (textNode.isMissingNode() || textNode.asText().isEmpty()) {
            throw new RuntimeException("Response format unexpected");
        }

        String jsonText = textNode.asText()
                .replace("```json", "")
                .replace("```", "")
                .trim();

        JsonNode queryJson = mapper.readTree(jsonText);

        String sql = queryJson.path("sql").asText("");
        String difficulty = queryJson.path("difficulty").asText("Unknown");
        String queryType = queryJson.path("queryType").asText("Unknown");

        sql = formatSql(sql);

        return new QueryResponse(
                sql,
                "",
                difficulty,
                queryType
        );
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

    public QueryResponse explainSQL(String sqlQuery) throws JsonProcessingException {
        RestTemplate restTemplate = new RestTemplate();

        String prompt = String.format("""
                You are a SQL mentor.

                Return explanation in this format:

                Purpose:
                <1 line>

                Key Points:
                • point 1
                • point 2
                • point 3

                SQL:
                %s
                """, sqlQuery);

        String requestBody = String.format("{\"contents\": [{\"parts\": [{\"text\": \"%s\"}]}]}",
                prompt.replace("\n", "\\n").replace("\"", "\\\""));

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        headers.set("x-goog-api-key", apiKey);

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);


        ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_API_URL, entity, String.class);
        String body = response.getBody();
        LOGGER.info("Raw response from Gemini API(explain MySQL): " + body);

        if (body == null || body.isEmpty()) {
            return new QueryResponse(
                    "",                                 // sql
                    "Empty response from API. Check logs.", // explanation
                    "",                                 // difficulty
                    ""                               // queryType
            );
        }

        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(body);
        JsonNode textNode = root.at("/candidates/0/content/parts/0/text");

        if (textNode.isMissingNode() || textNode.asText().isEmpty()) {
            return new QueryResponse("", "No SQL generated. Response format unexpected.", "", "");
        }

        String explanation = textNode.asText().trim();
        explanation = explanation.replaceAll("\\*\\*", "")
                .replaceAll("`", "");


        return new QueryResponse(
                "",
                explanation,
                "",
                ""
        );

    }

    public OptimizeResponse optimizeSQL(String sqlQuery) throws JsonProcessingException {

        RestTemplate restTemplate = new RestTemplate();

        String prompt = String.format("""
            You are a MySQL Performance Expert.

            Analyze this SQL query and return in exactly this format.

            Performance Score: X/10

            Issues:
            - issue 1
            - issue 2

            Suggestions:
            - optimization 1
            - optimization 2

            Optimized Query:
            SELECT ...

            SQL:
            %s
            """, sqlQuery);

        String requestBody = String.format(
                "{\"contents\": [{\"parts\": [{\"text\": \"%s\"}]}]}",
                prompt.replace("\n", "\\n")
                        .replace("\"", "\\\"")
        );

        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        headers.set("x-goog-api-key", apiKey);

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response =
                restTemplate.postForEntity(
                        GEMINI_API_URL,
                        entity,
                        String.class
                );

        String body = response.getBody();

        LOGGER.info("Optimize Response: " + body);

        if (body == null || body.isBlank()) {
            throw new RuntimeException("Empty response from Gemini");
        }

        ObjectMapper mapper = new ObjectMapper();

        JsonNode root = mapper.readTree(body);

        JsonNode textNode =
                root.at("/candidates/0/content/parts/0/text");

        if (textNode.isMissingNode() || textNode.asText().isBlank()) {
            throw new RuntimeException("Unexpected response format");
        }

        String optimization = textNode.asText()
                .replace("```sql", "")
                .replace("```", "")
                .replace("**", "")
                .replace("`", "")
                .trim();

        OptimizeResponse result = new OptimizeResponse();

        // Performance Score
        Matcher scoreMatcher = Pattern.compile(
                "Performance Score:\\s*(.*)"
        ).matcher(optimization);

        if (scoreMatcher.find()) {
            result.setPerformanceScore(scoreMatcher.group(1).trim());
        }

        // Issues
        List<String> issues = new ArrayList<>();

        Matcher issueMatcher = Pattern.compile(
                "Issues:(.*?)Optimizations:",
                Pattern.DOTALL
        ).matcher(optimization);

        if (issueMatcher.find()) {

            String[] lines = issueMatcher.group(1).split("\n");

            for (String line : lines) {

                line = line.replace("-", "")
                        .replaceAll("^\\d+\\.", "")
                        .trim();

                if (!line.isEmpty()) {
                    issues.add(line);
                }
            }
        }

        result.setIssues(issues);

        // Suggestions
        List<String> suggestions = new ArrayList<>();

        Matcher suggestionMatcher = Pattern.compile(
                "Suggestions:(.*?)Optimized Query:",
                Pattern.DOTALL
        ).matcher(optimization);

        if (suggestionMatcher.find()) {

            String[] lines = suggestionMatcher.group(1).split("\n");

            for (String line : lines) {

                line = line.replace("-", "")
                        .replaceAll("^\\d+\\.", "")
                        .trim();

                if (!line.isEmpty()) {
                    suggestions.add(line);
                }
            }
        }

        result.setSuggestions(suggestions);

        // Optimized Query
        Matcher queryMatcher = Pattern.compile(
                "Optimized Query:(.*)",
                Pattern.DOTALL
        ).matcher(optimization);

        if (queryMatcher.find()) {

            result.setOptimizedQuery(
                    queryMatcher.group(1)
                            .replace("```sql", "")
                            .replace("```", "")
                            .trim()
            );
        }

        return result;
    }
}

