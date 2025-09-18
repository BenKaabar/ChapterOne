package com.example.chapterone.L2_Service.BorrowedList;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Set;
import java.util.TreeMap;
import java.util.stream.Collectors;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.chapterone.L3_Repository.BookRepository;
import com.example.chapterone.L3_Repository.BorrowedListRepository;
import com.example.chapterone.L3_Repository.UserRepository;
import com.example.chapterone.L4_Model.Entites.Book;
import com.example.chapterone.L4_Model.Entites.BorrowedList;
import com.example.chapterone.L4_Model.Entites.User;
import com.example.chapterone.L4_Model.Enums.BookStatus;
import com.example.chapterone.L4_Model.Enums.BorrowStatus;
import com.example.chapterone.L4_Model.Enums.UserCategory;
import com.example.chapterone.L5_DTO.AllBorrowedBooksResponseDTO;
import com.example.chapterone.L5_DTO.BorrowedBarChartResponseDTO;
import com.example.chapterone.L5_DTO.BorrowedDonutChartResponseDTO;
import com.example.chapterone.L5_DTO.BorrowedLineChartResponseDTO;
import com.example.chapterone.L6_Exception.NotFoundException;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class BorrowedListServiceImpl implements BorrowedListService {
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private BorrowedListRepository borrowedListRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public void borrowBook(BorrowedList borrow) throws NotFoundException {
        User user = userRepository.findById(borrow.getIdUser())
                .orElseThrow(() -> new NotFoundException("User Not found with id " + borrow.getIdUser()));
        Book book = bookRepository.findById(borrow.getIdBook())
                .orElseThrow(() -> new NotFoundException("Book Not found with id " + borrow.getIdBook()));
        if (book.getStatus() != BookStatus.AVAILABLE) {
            throw new IllegalStateException("Book with id " + book.getIdBook() + " is not available for borrowing.");
        }
        LocalDate today = LocalDate.now();
        borrow.setBorrowDate(today);
        borrow.setStatus(BorrowStatus.CURRENT_BORROWED);
        if (user.getCategory() == UserCategory.Children) {
            borrow.setDueDate(today.plusWeeks(1));
        } else {
            borrow.setDueDate(today.plusWeeks(2));
        }
        book.setStatus(BookStatus.BORROWED);
        book.setTimesBorrowed(book.getTimesBorrowed() + 1);
        bookRepository.save(book);
        userRepository.save(user);
        borrowedListRepository.save(borrow);
    }

    @Override
    public void updateBorrowBook(BorrowedList newBorrow, String idBorrowedList) throws NotFoundException {
        log.info("Updating borrow record with ID: {}", idBorrowedList);
        BorrowedList oldBorrow = borrowedListRepository.findById(idBorrowedList)
                .orElseThrow(() -> new NotFoundException("Borrowed List Not found with id " + idBorrowedList));
        // -- Update User
        if (newBorrow.getIdUser() != null && !newBorrow.getIdUser().equals(oldBorrow.getIdUser())) { //
            User oldUser = userRepository.findById(oldBorrow.getIdUser())
                    .orElseThrow(() -> new NotFoundException("Old User not found with id " + oldBorrow.getIdUser()));
            User newUser = userRepository.findById(newBorrow.getIdUser())
                    .orElseThrow(() -> new NotFoundException("New User not found with id " + newBorrow.getIdUser()));
            oldBorrow.setIdUser(newBorrow.getIdUser());
            oldUser.setBooksBorrowed(oldUser.getBooksBorrowed() - 1);
            newUser.setBooksBorrowed(newUser.getBooksBorrowed() + 1);
            userRepository.save(oldUser);
            userRepository.save(newUser);
            log.info("Changing user from {} to {}", oldUser.getUsername(), newUser.getUsername());
        }
        // -- Update Book
        if (newBorrow.getIdBook() != null && !newBorrow.getIdBook().equals(oldBorrow.getIdBook())) {
            Book oldBook = bookRepository.findById(oldBorrow.getIdBook())
                    .orElseThrow(() -> new NotFoundException("Old Book not found with id " + oldBorrow.getIdBook()));
            Book newBook = bookRepository.findById(newBorrow.getIdBook())
                    .orElseThrow(() -> new NotFoundException("New Book not found with id " + newBorrow.getIdBook()));
            oldBorrow.setIdBook(newBorrow.getIdBook());
            oldBook.setTimesBorrowed(oldBook.getTimesBorrowed() - 1);
            newBook.setTimesBorrowed(newBook.getTimesBorrowed() + 1);
            bookRepository.save(oldBook);
            bookRepository.save(newBook);
            log.info("Changing borrowed book from '{}' to '{}'", oldBook.getTitle(), newBook.getTitle());
        }
        // -- Update Borrow Date
        if (newBorrow.getBorrowDate() != null || newBorrow.getDueDate() != null) {
            // both new borrow date and new due date are available
            if (newBorrow.getBorrowDate() != null && newBorrow.getDueDate() != null
                    && newBorrow.getBorrowDate().isBefore(newBorrow.getDueDate())) {
                oldBorrow.setBorrowDate(newBorrow.getBorrowDate());
                oldBorrow.setDueDate(newBorrow.getDueDate());
                log.info("Updated borrowDate to {} and dueDate to {}", newBorrow.getBorrowDate(),
                        newBorrow.getDueDate());
            }
            // only new borrow date available
            else if (newBorrow.getDueDate() == null && newBorrow.getBorrowDate().isBefore(oldBorrow.getDueDate())) {
                oldBorrow.setBorrowDate(newBorrow.getBorrowDate());
                log.info("Updated borrowDate to {}", newBorrow.getBorrowDate());
            }
            // only due date available
            else if (newBorrow.getBorrowDate() == null && newBorrow.getDueDate().isAfter(oldBorrow.getBorrowDate())) {
                oldBorrow.setDueDate(newBorrow.getDueDate());
                log.info("Updated dueDate to {}", newBorrow.getDueDate());
            } else {
                log.error("Invalid borrowDate/dueDate update request");
                throw new IllegalStateException("Impossible to change Borrow date or Due date");
            }
            borrowedListRepository.save(oldBorrow);
        }
    }

    @Override
    public void returnBook(String idBorrow) throws NotFoundException {
        log.info("Processing book return for borrow ID: {}", idBorrow);
        BorrowedList borrow = borrowedListRepository.findById(idBorrow)
                .orElseThrow(() -> new NotFoundException("Borrowed List Not found with id " + idBorrow));
        LocalDate today = LocalDate.now();
        borrow.setReturnDate(today);
        borrow.setStatus(BorrowStatus.ALREADY_RETURNED);
        Book book = bookRepository.findById(borrow.getIdBook())
                .orElseThrow(() -> new NotFoundException("Book not found with id " + borrow.getIdBook()));
        book.setStatus(BookStatus.AVAILABLE);
        bookRepository.save(book);
        borrowedListRepository.save(borrow);
        log.info("Book '{}' (ID: {}) returned successfully by user ID {}", book.getTitle(), book.getIdBook(),
                borrow.getIdUser());
    }

    @Override
    public void deactivateExpiredBooks() throws NotFoundException {
        LocalDate today = LocalDate.now();
        List<BorrowedList> borrowedLists = borrowedListRepository.findAll();
        int lateCount = 0;
        for (BorrowedList borrow : borrowedLists) {
            if (borrow.getReturnDate() == null && borrow.getDueDate() != null
                    && borrow.getDueDate().isBefore(today)) {
                borrow.setStatus(BorrowStatus.LATE_RETURNED);
                borrowedListRepository.save(borrow);
                lateCount++;
            }
        }
        if (lateCount > 0) {
            log.info("Total overdue books marked as LATE_RETURNED: {}", lateCount);
        } else {
            log.info("No overdue books found today ({})", today);
        }
    }

    @Override
    public List<AllBorrowedBooksResponseDTO> getAllBorrowedBooks(BorrowStatus status) throws NotFoundException {
        log.info("Fetching all borrowed books with status: {}", status);
        List<BorrowedList> borrowedLists = borrowedListRepository.findByStatus(status);
        if (borrowedLists.isEmpty()) {
            log.warn("No borrowed books found with status: {}", status);
            return Collections.emptyList();
        }
        List<AllBorrowedBooksResponseDTO> responseList = new ArrayList<>();
        for (BorrowedList bl : borrowedLists) {
            AllBorrowedBooksResponseDTO dto = new AllBorrowedBooksResponseDTO();
            Book book = bookRepository.findById(bl.getIdBook())
                    .orElseThrow(() -> new NotFoundException("Book not found with id " + bl.getIdBook()));
            User user = userRepository.findById(bl.getIdUser())
                    .orElseThrow(() -> new NotFoundException("User not found with id " + bl.getIdUser()));
            dto.setBook(book);
            dto.setUser(user);
            dto.setBorrowDate(bl.getBorrowDate());
            dto.setDueDate(bl.getDueDate());
            if (bl.getReturnDate() != null) {
                dto.setReturnDate(bl.getReturnDate());
            }
            dto.setStatus(bl.getStatus());
            responseList.add(dto);
        }
        log.info("Total borrowed books found: {}", responseList.size());
        return responseList;
    }

    @Override
    public List<BorrowedBarChartResponseDTO> getBarChartBorrowedBooks(String period) {
        List<BorrowedList> borrowedLists = borrowedListRepository.findAll();
        Set<BorrowStatus> allStatuses = EnumSet.allOf(BorrowStatus.class);

        Map<BorrowStatus, List<Integer>> statusMap = new HashMap<>();
        Map<BorrowStatus, List<String>> labelMap = new HashMap<>();

        if (period == null || period.isEmpty()) {
            throw new IllegalArgumentException("Period must not be null or empty");
        }

        // ---------- CASE 1 : ALL PERIOD ----------
        if ("all".equalsIgnoreCase(period)) {
            Map<YearMonth, Map<BorrowStatus, Integer>> tempMap = new TreeMap<>();

            for (BorrowedList bl : borrowedLists) {
                LocalDate borrowDate = bl.getBorrowDate();
                if (borrowDate == null)
                    continue;

                YearMonth ym = YearMonth.from(borrowDate);

                tempMap.putIfAbsent(ym, new HashMap<>());
                Map<BorrowStatus, Integer> statusCounts = tempMap.get(ym);
                BorrowStatus status = bl.getStatus();
                statusCounts.put(status, statusCounts.getOrDefault(status, 0) + 1);
            }

            for (Map.Entry<YearMonth, Map<BorrowStatus, Integer>> entry : tempMap.entrySet()) {
                YearMonth ym = entry.getKey();
                String label = ym.getMonth().name().substring(0, 3) + " " + ym.getYear();

                for (BorrowStatus st : allStatuses) {
                    statusMap.putIfAbsent(st, new ArrayList<>());
                    labelMap.putIfAbsent(st, new ArrayList<>());

                    statusMap.get(st).add(entry.getValue().getOrDefault(st, 0));
                    labelMap.get(st).add(label);
                }
            }
        }
        // ---------- CASE 2 : SPECIFIC YEAR ----------
        else if (period.matches("\\d{4}")) {
            int year = Integer.parseInt(period);

            for (BorrowStatus st : allStatuses) {
                statusMap.put(st, new ArrayList<>(Collections.nCopies(12, 0)));
                labelMap.put(st, new ArrayList<>(Arrays.asList(
                        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")));
            }

            for (BorrowedList bl : borrowedLists) {
                LocalDate borrowDate = bl.getBorrowDate();
                if (borrowDate != null && borrowDate.getYear() == year) {
                    BorrowStatus st = bl.getStatus();
                    int monthIndex = borrowDate.getMonthValue() - 1;
                    statusMap.get(st).set(monthIndex, statusMap.get(st).get(monthIndex) + 1);
                }
            }
        }
        // ---------- CASE 3 : SPECIFIC MONTH ----------
        else if (period.matches("\\d{6}")) { // Format MMyyyy
            int month = Integer.parseInt(period.substring(0, 2));
            int year = Integer.parseInt(period.substring(2));
            YearMonth ym = YearMonth.of(year, month);
            int daysInMonth = ym.lengthOfMonth();

            for (BorrowStatus st : allStatuses) {
                statusMap.put(st, new ArrayList<>(Collections.nCopies(daysInMonth, 0)));
                labelMap.put(st, new ArrayList<>());
                for (int d = 1; d <= daysInMonth; d++) {
                    labelMap.get(st).add(String.valueOf(d));
                }
            }

            for (BorrowedList bl : borrowedLists) {
                LocalDate borrowDate = bl.getBorrowDate();
                if (borrowDate != null &&
                        borrowDate.getYear() == year &&
                        borrowDate.getMonthValue() == month) {

                    BorrowStatus st = bl.getStatus();
                    int dayIndex = borrowDate.getDayOfMonth() - 1;
                    statusMap.get(st).set(dayIndex, statusMap.get(st).get(dayIndex) + 1);
                }
            }
        } else {
            throw new IllegalArgumentException("Invalid period format. Use 'all', 'YYYY', or 'MMyyyy'");
        }

        // ----------- Build DTOs -----------
        List<BorrowedBarChartResponseDTO> result = new ArrayList<>();
        for (BorrowStatus st : allStatuses) {
            result.add(new BorrowedBarChartResponseDTO(
                    st.name(),
                    statusMap.get(st).stream().mapToInt(Integer::intValue).toArray(),
                    labelMap.get(st).toArray(new String[0])));
        }

        return result;
    }

    @Override
    public List<BorrowedLineChartResponseDTO> getLineChartBorrowedBooks(String period) {
        List<BorrowedList> borrowedLists = borrowedListRepository.findAll();
        List<User> users = userRepository.findAll();

        // All categories (Children, Youths, Old)
        Set<UserCategory> allCategories = EnumSet.allOf(UserCategory.class);

        // Maps for values and labels
        Map<UserCategory, List<Integer>> categoryMap = new HashMap<>();
        Map<UserCategory, List<String>> labelMap = new HashMap<>();

        for (UserCategory cat : allCategories) {
            categoryMap.put(cat, new ArrayList<>());
            labelMap.put(cat, new ArrayList<>());
        }

        if (period == null || period.isEmpty()) {
            throw new IllegalArgumentException("Period must not be null or empty");
        }

        // ---------- CASE 1 : ALL ----------
        if ("all".equalsIgnoreCase(period)) {
            Map<YearMonth, Map<UserCategory, Integer>> tempMap = new TreeMap<>();

            for (BorrowedList bl : borrowedLists) {
                LocalDate borrowDate = bl.getBorrowDate();
                if (borrowDate == null)
                    continue;

                User user = users.stream()
                        .filter(u -> u.getIdUser().equals(bl.getIdUser()))
                        .findFirst()
                        .orElse(null);
                if (user == null)
                    continue;

                UserCategory cat = user.getCategory();
                YearMonth ym = YearMonth.from(borrowDate);

                tempMap.putIfAbsent(ym, new HashMap<>());
                Map<UserCategory, Integer> counts = tempMap.get(ym);
                counts.put(cat, counts.getOrDefault(cat, 0) + 1);
            }

            for (Map.Entry<YearMonth, Map<UserCategory, Integer>> entry : tempMap.entrySet()) {
                YearMonth ym = entry.getKey();
                String label = ym.getMonth().name().substring(0, 3) + " " + ym.getYear();

                for (UserCategory cat : allCategories) {
                    categoryMap.get(cat).add(entry.getValue().getOrDefault(cat, 0));
                    labelMap.get(cat).add(label);
                }
            }
        }
        // ---------- CASE 2 : YEAR ----------
        else if (period.matches("\\d{4}")) {
            int year = Integer.parseInt(period);

            for (UserCategory cat : allCategories) {
                labelMap.put(cat, new ArrayList<>(Arrays.asList(
                        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")));
                categoryMap.put(cat, new ArrayList<>(Collections.nCopies(12, 0)));
            }

            for (BorrowedList bl : borrowedLists) {
                LocalDate borrowDate = bl.getBorrowDate();
                if (borrowDate != null && borrowDate.getYear() == year) {
                    User user = users.stream()
                            .filter(u -> u.getIdUser().equals(bl.getIdUser()))
                            .findFirst()
                            .orElse(null);
                    if (user == null)
                        continue;

                    UserCategory cat = user.getCategory();
                    int monthIndex = borrowDate.getMonthValue() - 1;
                    categoryMap.get(cat).set(monthIndex, categoryMap.get(cat).get(monthIndex) + 1);
                }
            }
        }
        // ---------- CASE 3 : MONTH ----------
        else if (period.matches("\\d{6}")) {
            int month = Integer.parseInt(period.substring(0, 2));
            int year = Integer.parseInt(period.substring(2));

            if (month < 1 || month > 12) {
                throw new IllegalArgumentException("Month must be between 01 and 12");
            }

            YearMonth ym = YearMonth.of(year, month);
            int daysInMonth = ym.lengthOfMonth();

            for (UserCategory cat : allCategories) {
                labelMap.put(cat, new ArrayList<>());
                categoryMap.put(cat, new ArrayList<>(Collections.nCopies(daysInMonth, 0)));
                for (int d = 1; d <= daysInMonth; d++) {
                    labelMap.get(cat).add(String.valueOf(d));
                }
            }

            for (BorrowedList bl : borrowedLists) {
                LocalDate borrowDate = bl.getBorrowDate();
                if (borrowDate != null &&
                        borrowDate.getYear() == year &&
                        borrowDate.getMonthValue() == month) {

                    User user = users.stream()
                            .filter(u -> u.getIdUser().equals(bl.getIdUser()))
                            .findFirst()
                            .orElse(null);
                    if (user == null)
                        continue;

                    UserCategory cat = user.getCategory();
                    int dayIndex = borrowDate.getDayOfMonth() - 1;
                    categoryMap.get(cat).set(dayIndex, categoryMap.get(cat).get(dayIndex) + 1);
                }
            }
        } else {
            throw new IllegalArgumentException("Invalid period format. Use 'all', 'YYYY', or 'MMyyyy'");
        }

        // ---------- Build DTOs ----------
        List<BorrowedLineChartResponseDTO> result = new ArrayList<>();
        for (UserCategory cat : allCategories) {
            result.add(new BorrowedLineChartResponseDTO(
                    cat.name(), // "Children", "Youths", "Old"
                    categoryMap.get(cat).stream().mapToInt(Integer::intValue).toArray(),
                    labelMap.get(cat).toArray(new String[0])));
        }

        return result;
    }

    @Override
    public List<BorrowedDonutChartResponseDTO> getDonutChartBorrowedBooks(String period) {
        LocalDate startDate;
        LocalDate endDate = LocalDate.now();

        if ("all".equalsIgnoreCase(period)) {
            startDate = LocalDate.of(2025, 1, 1); // very old date, include all
        } else if (period.matches("\\d{4}")) { // year only
            int year = Integer.parseInt(period);
            startDate = LocalDate.of(year, 1, 1);
            endDate = LocalDate.of(year, 12, 31);
        } else if (period.matches("\\d{6}")) { // MMyyyy
            int month = Integer.parseInt(period.substring(0, 2));
            int year = Integer.parseInt(period.substring(2));
            startDate = LocalDate.of(year, month, 1);
            endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        } else {
            throw new IllegalArgumentException("Invalid period format. Use 'all', 'YYYY', or 'MMyyyy'");
        }

        // 1. Get borrowed books in period
        List<BorrowedList> borrowedBooks = borrowedListRepository.findByBorrowDateBetween(startDate, endDate);

        // 2. Group by BookCategory
        Map<String, Long> groupedByCategory = borrowedBooks.stream()
                .map(b -> bookRepository.findById(b.getIdBook()).orElse(null))
                .collect(Collectors.groupingBy(b -> b.getCategory().getName(), Collectors.counting()));

        // 3. Convert to DTO
        return groupedByCategory.entrySet().stream()
                .map(entry -> new BorrowedDonutChartResponseDTO(entry.getKey(), entry.getValue().intValue()))
                .collect(Collectors.toList());
    }

}
