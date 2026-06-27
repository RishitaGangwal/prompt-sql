package com.promptsql.server.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.promptsql.server.model.QueryRequest;
import com.promptsql.server.model.QueryResponse;
import com.promptsql.server.service.QueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class QueryController {

    @Autowired
    private QueryService queryService;

    @Autowired
    public QueryController(QueryService queryService) {
        this.queryService = queryService;
    }

    @PostMapping("/generate-query")
    public QueryResponse generateQuery(@RequestBody QueryRequest request) throws JsonProcessingException {
        return queryService.generateSQL(request);

    }

    @PostMapping("/explain-query")
    public QueryResponse explainQuery(@RequestBody Map<String, String> body) throws JsonProcessingException {

        String sql = body.get("sql");

        return queryService.explainSQL(sql);

    }

    @PostMapping("/optimize-query")
    public QueryResponse optimizeQuery(@RequestBody Map<String, String> body) throws JsonProcessingException {

        return queryService.optimizeSQL(body.get("sql"));
    }
}
