package com.example.chapterone.L4_Model.Entites;

import java.time.LocalDate;
import java.util.UUID;

import org.springframework.data.annotation.Id;

import org.springframework.data.mongodb.core.mapping.Document;

import com.example.chapterone.L4_Model.Enums.Gender;
import com.example.chapterone.L4_Model.Enums.Status;
import com.example.chapterone.L4_Model.Enums.UserCategory;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "users")

public class User {
    @Id
    private String idUser = UUID.randomUUID().toString();
    private String username;
    private String phoneNumber1;
    private String phoneNumber2;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate dateOfBirth;
    private String work;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate createdAt;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate membershipStartDate;
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate membershipEndDate;
    private int booksBorrowed;
    private Gender gender;
    private Status membershipStatus; 
    private UserCategory category;
}