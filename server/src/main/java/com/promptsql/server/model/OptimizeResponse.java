package com.promptsql.server.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OptimizeResponse {
    private String performanceScore;
    private List<String> issues;
    private List<String> suggestions;
    private String optimizedQuery;
}
