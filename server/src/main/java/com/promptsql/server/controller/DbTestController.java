package com.promptsql.server.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@RestController
public class DbTestController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/db-test")
    public String test() {
        try (Connection conn = dataSource.getConnection()) {
            return "DB Connected: " + conn.getMetaData().getURL();
        } catch (SQLException e) {
            return "DB Connection failed: " + e.getMessage();
        }
    }
}

