package com.example.chapterone.L2_Service.User;

import java.util.List;

import com.example.chapterone.L4_Model.Entites.User;
import com.example.chapterone.L4_Model.Enums.Status;
import com.example.chapterone.L5_DTO.UserBarChartResponseDTO;
import com.example.chapterone.L5_DTO.UserDonutChartResponseDTO;
import com.example.chapterone.L5_DTO.UserLineChartResponseDTO;
import com.example.chapterone.L6_Exception.NotFoundException;

public interface UserService {
    void createUser(User user);

    void updateUser(User user, String idUser) throws NotFoundException;

    void updateUserStatus(String idUser, Status status) throws NotFoundException;

    void updateUserStatusesAndCategories();

    List<User> getUsersByStatus(Status status);

    List<UserLineChartResponseDTO> getUserLineChart(String period);

    List<UserBarChartResponseDTO> getUserBarChart(String period);

    List<UserDonutChartResponseDTO> getUserDonutChart(String period);
}
