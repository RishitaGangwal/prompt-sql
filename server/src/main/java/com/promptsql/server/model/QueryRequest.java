package com.promptsql.server.model;

public class QueryRequest {

    private String dbType;
    private String tableName;
    private String fields;
    private String queryInstructions;


    public String getDbType() {
        return dbType;
    }

    public void setDbType(String dbType) {
        this.dbType = dbType;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getFields() {
        return fields;
    }

    public void setFields(String fields) {
        this.fields = fields;
    }

    public String getQueryInstructions() {
        return queryInstructions;
    }

    public void setQueryInstructions(String queryInstructions) {

        this.queryInstructions = queryInstructions;
    }

}
