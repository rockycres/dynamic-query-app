package com.learn.queryapp.api;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
public class DynamicQueryController {

    List<String> functionList = Arrays.asList("PensionPrePaymentReport","PensionPostPaymentReport", "EDI Contriburtion Report");

    List<String> envList = Arrays.asList("S1","S2", "S3");







    @GetMapping("/api/functions")
    public ResponseEntity<List<Environment>> getAllEnvironments() {
        List<Environment> envs = getEnvs();
        return ResponseEntity.ok(envs);
    }

    @GetMapping("/api/sqlqueries/{envKey}")
    public ResponseEntity<List<ReportingFunction>> getAllFunctionalities(@PathVariable("envKey") String envKey) {
        List<ReportingFunction> functionalities = getFunctions(envKey);
        return ResponseEntity.ok(functionalities);
    }

    @GetMapping("/api/fields/{selectedFunctionality}/{selectedSqlQuery}")
    public ResponseEntity<List<FunctionField>> getFields(@PathVariable("selectedFunctionality") String selectedFunctionality, @PathVariable("selectedSqlQuery") String selectedSqlQuery ) {
        List<FunctionField> functionFields = getFunctionFields();
        return ResponseEntity.ok(functionFields);
    }

    private List<FunctionField> getFunctionFields() {
        List<FunctionField> functionFields = new ArrayList<>();

        FunctionField field1 = new FunctionField();
        field1.setFieldType("date");
        field1.setFieldName("DOB");
        functionFields.add(field1);

        FunctionField field2 = new FunctionField();
        field2.setFieldType("number");
        field2.setFieldName("Age");
        functionFields.add(field2);

        FunctionField field3 = new FunctionField();
        field3.setFieldType("text");
        field3.setFieldName("Name");
        functionFields.add(field3);

        return functionFields;

    }

    private List<Environment> getEnvs() {

        List<Environment> envs = new ArrayList<>();
        for (String envKey :envList) {
            Environment env = new Environment();
            env.setEnvKey(envKey);
            env.setEnvId(envKey);
            envs.add(env);
        }

        return envs;

    }

    private List<ReportingFunction> getFunctions(String envKey) {

        List<ReportingFunction> functions = new ArrayList<>();
        for (String functionKey :functionList) {
            ReportingFunction reportingFunction = new ReportingFunction();
            reportingFunction.setFunctionKey(functionKey);
            reportingFunction.setFunctionId(functionKey);
            functions.add(reportingFunction);
        }

        return functions;

    }

}
