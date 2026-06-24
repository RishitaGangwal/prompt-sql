package com.promptsql.server.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QueryResponse {
    private String sql;
    private String explanation;
    private String optimization;
    private String difficulty;
    private String queryType;

}
