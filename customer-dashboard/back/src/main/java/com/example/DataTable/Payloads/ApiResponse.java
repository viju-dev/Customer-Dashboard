package com.example.DataTable.Payloads;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T>{
    private String message;
    private Boolean success;
    private T payload;
    public ApiResponse(String message, Boolean success){
        this.message = message;
        this.success = success;
    }

}
