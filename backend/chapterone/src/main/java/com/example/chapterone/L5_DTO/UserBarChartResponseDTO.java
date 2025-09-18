package com.example.chapterone.L5_DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class UserBarChartResponseDTO {
    private String gender;
    private int[] values;
    private String[] labels;
}
