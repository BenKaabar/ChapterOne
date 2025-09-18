package com.example.chapterone.L2_Service.User;

import java.time.LocalDate;
import java.time.Period;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.chapterone.L3_Repository.UserRepository;
import com.example.chapterone.L4_Model.Entites.User;
import com.example.chapterone.L4_Model.Enums.Status;
import com.example.chapterone.L4_Model.Enums.UserCategory;
import com.example.chapterone.L5_DTO.UserBarChartResponseDTO;
import com.example.chapterone.L5_DTO.UserDonutChartResponseDTO;
import com.example.chapterone.L5_DTO.UserLineChartResponseDTO;
import com.example.chapterone.L6_Exception.NotFoundException;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public void createUser(User user) {
        log.info("user data {}", user);
        LocalDate today = LocalDate.now();
        User newUser = new User();
        newUser.setUsername(user.getUsername());
        newUser.setPhoneNumber1(user.getPhoneNumber1());
        if (user.getPhoneNumber2() != null) {
            newUser.setPhoneNumber2(user.getPhoneNumber2());
        }
        newUser.setDateOfBirth(user.getDateOfBirth());
        newUser.setWork(user.getWork());
        newUser.setGender(user.getGender());
        if (user.getDateOfBirth() != null) {
            int age = Period.between(user.getDateOfBirth(), today).getYears();
            if (age <= 12) {
                newUser.setCategory(UserCategory.Children);
            } else if (age <= 25) {
                newUser.setCategory(UserCategory.Youths);
            } else {
                newUser.setCategory(UserCategory.Old);
            }
        }
        newUser.setMembershipStatus(user.getMembershipStatus());
        newUser.setBooksBorrowed(0);
        newUser.setCreatedAt(today);

        if (newUser.getMembershipStatus() == Status.Active) {
            newUser.setMembershipStartDate(today);
            newUser.setMembershipEndDate(today.plusYears(1).minusDays(1));
        }
        userRepository.save(newUser);
        log.info("user created successfully ");
    }

    @Override
    public void updateUser(User user, String idUser) throws NotFoundException {
        User existingUser = userRepository.findById(idUser)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + idUser));

        Optional.ofNullable(user.getUsername()).ifPresent(existingUser::setUsername);
        Optional.ofNullable(user.getPhoneNumber1()).ifPresent(existingUser::setPhoneNumber1);
        Optional.ofNullable(user.getPhoneNumber2()).ifPresent(existingUser::setPhoneNumber2);
        Optional.ofNullable(user.getDateOfBirth()).ifPresent(existingUser::setDateOfBirth);
        Optional.ofNullable(user.getWork()).ifPresent(existingUser::setWork);
        Optional.ofNullable(user.getMembershipStartDate()).ifPresent(existingUser::setMembershipStartDate);
        Optional.ofNullable(user.getMembershipEndDate()).ifPresent(existingUser::setMembershipEndDate);
        Optional.ofNullable(user.getBooksBorrowed()).ifPresent(existingUser::setBooksBorrowed);
        Optional.ofNullable(user.getGender()).ifPresent(existingUser::setGender);
        Optional.ofNullable(user.getMembershipStatus()).ifPresent(existingUser::setMembershipStatus);
        if (user.getDateOfBirth() != null) {
            LocalDate today = LocalDate.now();
            int age = Period.between(user.getDateOfBirth(), today).getYears();
            if (age <= 12) {
                existingUser.setCategory(UserCategory.Children);
            } else if (age <= 25) {
                existingUser.setCategory(UserCategory.Youths);
            } else {
                existingUser.setCategory(UserCategory.Old);
            }
        }
        userRepository.save(existingUser);
        log.info("User updated successfully: {}", existingUser.getIdUser());
    }

    @Override
    public void updateUserStatus(String idUser, Status status) throws NotFoundException {
        User existingUser = userRepository.findById(idUser)
                .orElseThrow(() -> new NotFoundException("User not found with id: " + idUser));

        existingUser.setMembershipStatus(status);

        if (status == Status.Active) {
            LocalDate today = LocalDate.now();
            existingUser.setMembershipStartDate(today);
            existingUser.setMembershipEndDate(today.plusYears(1).minusDays(1));
        } else {
            existingUser.setMembershipStartDate(null);
            existingUser.setMembershipEndDate(null);
        }

        userRepository.save(existingUser);
        log.info("User status updated to {} for user: {}", status, existingUser.getIdUser());
    }

    @Override
    public void updateUserStatusesAndCategories() {
        List<User> allUsers = userRepository.findAll();
        LocalDate today = LocalDate.now();
        List<User> usersToUpdate = new ArrayList<>();
        for (User user : allUsers) {
            boolean updated = false;
            if (user.getMembershipEndDate() != null
                    && user.getMembershipEndDate().isBefore(today)
                    && user.getMembershipStatus() == Status.Active) {
                user.setMembershipStatus(Status.Inactive);
                updated = true;
                log.info("Deactivating expired user: {}", user.getUsername());
            }
            if (user.getDateOfBirth() != null) {
                int age = Period.between(user.getDateOfBirth(), today).getYears();
                UserCategory newCategory;
                if (age <= 12) {
                    newCategory = UserCategory.Children;
                } else if (age <= 25) {
                    newCategory = UserCategory.Youths;
                } else {
                    newCategory = UserCategory.Old;
                }
                if (user.getCategory() != newCategory) {
                    user.setCategory(newCategory);
                    updated = true;
                    log.info("Updating category for user {}: {}", user.getUsername(), newCategory);
                }
            }
            if (updated) {
                usersToUpdate.add(user);
            }
        }
        if (!usersToUpdate.isEmpty()) {
            userRepository.saveAll(usersToUpdate);
            log.info("Total users updated: {}", usersToUpdate.size());
        }
    }

    @Override
    public List<User> getUsersByStatus(Status status) {
        return userRepository.findAll().stream()
                .filter(user -> user.getMembershipStatus() == status)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserLineChartResponseDTO> getUserLineChart(String period) {
        List<User> users = userRepository.findAll();
        Map<String, List<Integer>> categoryMap = new HashMap<>();
        Map<String, List<String>> labelMap = new HashMap<>();
        String[] categories = { "Children", "Youths", "Old" };
        for (String cat : categories) {
            categoryMap.put(cat, new ArrayList<>());
            labelMap.put(cat, new ArrayList<>());
        }

        if (period == null || period.isEmpty()) {
            throw new IllegalArgumentException("Period must not be null or empty");
        }
        // --- CASE 1: ALL DATA ---
        if ("all".equalsIgnoreCase(period)) {
            Map<YearMonth, Map<String, Integer>> tempMap = new TreeMap<>();
            for (User u : users) {
                YearMonth ym = YearMonth.from(u.getCreatedAt());
                tempMap.putIfAbsent(ym, new HashMap<>());
                Map<String, Integer> catCounts = tempMap.get(ym);
                String cat = u.getCategory().name();
                catCounts.put(cat, catCounts.getOrDefault(cat, 0) + 1);
            }
            for (Map.Entry<YearMonth, Map<String, Integer>> entry : tempMap.entrySet()) {
                YearMonth ym = entry.getKey();
                String label = ym.getMonth().name().substring(0, 3) + " " + ym.getYear();
                Map<String, Integer> counts = entry.getValue();
                for (String cat : categories) {
                    categoryMap.get(cat).add(counts.getOrDefault(cat, 0));
                    labelMap.get(cat).add(label);
                }
            }

        } else if (period.matches("\\d{4}")) {
            // --- CASE 2: YEAR only ---
            int year = Integer.parseInt(period);
            for (String cat : categories) {
                labelMap.put(cat, new ArrayList<>(Arrays.asList(
                        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")));
                categoryMap.put(cat, new ArrayList<>(Collections.nCopies(12, 0)));
            }

            for (User u : users) {
                if (u.getCreatedAt().getYear() == year) {
                    String cat = u.getCategory().name();
                    int monthIndex = u.getCreatedAt().getMonthValue() - 1;
                    categoryMap.get(cat).set(monthIndex, categoryMap.get(cat).get(monthIndex) + 1);
                }
            }

        } else if (period.matches("\\d{6}")) {
            // --- CASE 3: MONTH + YEAR (MMyyyy) ---
            int month = Integer.parseInt(period.substring(0, 2));
            int year = Integer.parseInt(period.substring(2));

            if (month < 1 || month > 12) {
                throw new IllegalArgumentException("Month must be between 01 and 12");
            }

            YearMonth ym = YearMonth.of(year, month);
            int daysInMonth = ym.lengthOfMonth();

            for (String cat : categories) {
                labelMap.put(cat, new ArrayList<>());
                categoryMap.put(cat, new ArrayList<>(Collections.nCopies(daysInMonth, 0)));
                for (int d = 1; d <= daysInMonth; d++) {
                    labelMap.get(cat).add(String.valueOf(d));
                }
            }

            for (User u : users) {
                if (u.getCreatedAt().getYear() == year && u.getCreatedAt().getMonthValue() == month) {
                    String cat = u.getCategory().name();
                    int dayIndex = u.getCreatedAt().getDayOfMonth() - 1;
                    categoryMap.get(cat).set(dayIndex, categoryMap.get(cat).get(dayIndex) + 1);
                }
            }

        } else {
            throw new IllegalArgumentException("Invalid period format. Use 'all', 'YYYY', or 'MMyyyy'");
        }

        // Build DTO
        List<UserLineChartResponseDTO> result = new ArrayList<>();
        for (String cat : categories) {
            result.add(new UserLineChartResponseDTO(
                    cat,
                    categoryMap.get(cat).stream().mapToInt(Integer::intValue).toArray(),
                    labelMap.get(cat).toArray(new String[0])));
        }

        return result;
    }

    @Override
    public List<UserBarChartResponseDTO> getUserBarChart(String period) {
        List<User> users = userRepository.findAll();
        Map<String, List<Integer>> genderMap = new HashMap<>();
        Map<String, List<String>> labelMap = new HashMap<>();
        String[] genders = { "Male", "Female" };

        for (String g : genders) {
            genderMap.put(g, new ArrayList<>());
            labelMap.put(g, new ArrayList<>());
        }

        if (period == null || period.isEmpty()) {
            throw new IllegalArgumentException("Period must not be null or empty");
        }

        // --- CASE 1: ALL DATA ---
        if ("all".equalsIgnoreCase(period)) {
            Map<YearMonth, Map<String, Integer>> tempMap = new TreeMap<>();
            for (User u : users) {
                YearMonth ym = YearMonth.from(u.getCreatedAt());
                tempMap.putIfAbsent(ym, new HashMap<>());
                Map<String, Integer> counts = tempMap.get(ym);
                String gender = u.getGender().name();
                counts.put(gender, counts.getOrDefault(gender, 0) + 1);
            }

            for (Map.Entry<YearMonth, Map<String, Integer>> entry : tempMap.entrySet()) {
                YearMonth ym = entry.getKey();
                String label = ym.getMonth().name().substring(0, 3) + " " + ym.getYear();
                Map<String, Integer> counts = entry.getValue();
                for (String g : genders) {
                    genderMap.get(g).add(counts.getOrDefault(g, 0));
                    labelMap.get(g).add(label);
                }
            }

        } else if (period.matches("\\d{4}")) {
            // --- CASE 2: YEAR only ---
            int year = Integer.parseInt(period);
            for (String g : genders) {
                labelMap.put(g, new ArrayList<>(Arrays.asList(
                        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")));
                genderMap.put(g, new ArrayList<>(Collections.nCopies(12, 0)));
            }

            for (User u : users) {
                if (u.getCreatedAt().getYear() == year) {
                    String g = u.getGender().name();
                    int monthIndex = u.getCreatedAt().getMonthValue() - 1;
                    genderMap.get(g).set(monthIndex, genderMap.get(g).get(monthIndex) + 1);
                }
            }

        } else if (period.matches("\\d{6}")) {
            // --- CASE 3: MONTH + YEAR ---
            int month = Integer.parseInt(period.substring(0, 2));
            int year = Integer.parseInt(period.substring(2));

            if (month < 1 || month > 12) {
                throw new IllegalArgumentException("Month must be between 01 and 12");
            }

            YearMonth ym = YearMonth.of(year, month);
            int daysInMonth = ym.lengthOfMonth();

            for (String g : genders) {
                labelMap.put(g, new ArrayList<>());
                genderMap.put(g, new ArrayList<>(Collections.nCopies(daysInMonth, 0)));
                for (int d = 1; d <= daysInMonth; d++) {
                    labelMap.get(g).add(String.valueOf(d));
                }
            }

            for (User u : users) {
                if (u.getCreatedAt().getYear() == year && u.getCreatedAt().getMonthValue() == month) {
                    String g = u.getGender().name();
                    int dayIndex = u.getCreatedAt().getDayOfMonth() - 1;
                    genderMap.get(g).set(dayIndex, genderMap.get(g).get(dayIndex) + 1);
                }
            }

        } else {
            throw new IllegalArgumentException("Invalid period format. Use 'all', 'YYYY', or 'MMyyyy'");
        }

        // Build DTO
        List<UserBarChartResponseDTO> result = new ArrayList<>();
        for (String g : genders) {
            result.add(new UserBarChartResponseDTO(
                    g,
                    genderMap.get(g).stream().mapToInt(Integer::intValue).toArray(),
                    labelMap.get(g).toArray(new String[0])));
        }

        return result;
    }

    @Override
    public List<UserDonutChartResponseDTO> getUserDonutChart(String period) {
        List<User> users = userRepository.findAll();
        Map<Status, Integer> statusCount = new EnumMap<>(Status.class);
        for (Status s : Status.values()) {
            statusCount.put(s, 0);
        }
        for (User u : users) {
            boolean include = false;
            if ("all".equalsIgnoreCase(period)) {
                include = true;
            } else if (period.matches("\\d{4}")) {
                int year = Integer.parseInt(period);
                include = u.getCreatedAt().getYear() == year;
            } else if (period.matches("\\d{6}")) {
                int month = Integer.parseInt(period.substring(0, 2));
                int year = Integer.parseInt(period.substring(2));
                include = u.getCreatedAt().getYear() == year && u.getCreatedAt().getMonthValue() == month;
            } else {
                throw new IllegalArgumentException("Invalid period format. Use 'all', 'YYYY', or 'MMyyyy'");
            }
            if (include) {
                Status status = u.getMembershipStatus();
                statusCount.put(status, statusCount.getOrDefault(status, 0) + 1);
            }
        }
        List<UserDonutChartResponseDTO> result = new ArrayList<>();
        for (Status s : Status.values()) {
            result.add(new UserDonutChartResponseDTO(s.name(), statusCount.get(s)));
        }

        return result;
    }

}
