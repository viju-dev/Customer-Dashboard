package com.example.DataTable.EntryDtos;

import com.example.DataTable.Enums.GenderEnum;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

@Data
public class CustomerEntryDto {

    private String name;

    private int age;

    @Enumerated(value = EnumType.STRING)
    private GenderEnum gender;

    private String contact;

}
