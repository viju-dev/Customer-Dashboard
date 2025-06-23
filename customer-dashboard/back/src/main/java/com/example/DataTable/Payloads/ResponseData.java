package com.example.DataTable.Payloads;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
//@AllArgsConstructor
public class ResponseData<T> {
    private T data ;
    public ResponseData(T data) { this.data = data; } // constructor

}
