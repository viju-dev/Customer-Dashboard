package com.example.DataTable.Payloads;
public class ResponseError<T> {
    private T error ;
    public ResponseError(T error) { this.error = error; } // constructor
}
