package com.example.chapterone.L5_DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDonutChartResponseDTO {
    private String status;
    private int count;
}
