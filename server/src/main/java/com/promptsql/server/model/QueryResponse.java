package com.promptsql.server.model;

public class QueryResponse {
    public String sql;
    private String explanation;

    public QueryResponse(String sql, String explanation){
        this.sql = sql;
        this.explanation = explanation;
    }

    public String getSql() {
        return sql;
    }

    public void setSql(String sql) {
        this.sql = sql;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
