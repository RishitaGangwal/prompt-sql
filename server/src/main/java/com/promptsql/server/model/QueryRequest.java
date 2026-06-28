package com.promptsql.server.model;

public class QueryRequest {

    private String dbType;
    private String tableName;
    private String schema;
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

    public String getSchema() {
        return schema;
    }

    public void setSchema(String fields) {
        this.schema = schema;
    }

    public String getQueryInstructions() {
        return queryInstructions;
    }

    public void setQueryInstructions(String queryInstructions) {

        this.queryInstructions = queryInstructions;
    }

}
