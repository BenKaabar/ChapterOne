package com.example.chapterone.L2_Service.Book;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.chapterone.L3_Repository.AuthorRepository;
import com.example.chapterone.L3_Repository.BookCategoryRepository;
import com.example.chapterone.L3_Repository.BookRepository;
import com.example.chapterone.L4_Model.Entites.Author;
import com.example.chapterone.L4_Model.Entites.Book;
import com.example.chapterone.L4_Model.Enums.BookStatus;
import com.example.chapterone.L4_Model.Enums.Language;
import com.example.chapterone.L4_Model.Models.BookCategory;
import com.example.chapterone.L5_DTO.BookBarChartResponseDTO;
import com.example.chapterone.L5_DTO.BookDonutChartResponseDTO;
import com.example.chapterone.L5_DTO.BookLineChartResponseDTO;
import com.example.chapterone.L6_Exception.NotFoundException;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class BookServiceImpl implements BookService {
    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private BookCategoryRepository bookCategoryRepository;
    @Autowired
    private AuthorRepository authorRepository;

    @Override
    public void addBook(Book book) throws NotFoundException {
        log.info("Adding new book: {}", book.getTitle());
        LocalDate today = LocalDate.now();
        book.setCreatedAt(today);
        book.setStatus(book.getStatus());
        book.setTimesBorrowed(0);
        Author primaryAuthor = authorRepository.findById(book.getPrimaryAuthor().getIdAuthor())
                .orElseThrow(() -> new NotFoundException(
                        "Primary Author not found with id: " + book.getPrimaryAuthor().getIdAuthor()));
        primaryAuthor.setBooksOwned(primaryAuthor.getBooksOwned() + 1);
        authorRepository.save(primaryAuthor);
        if (book.getCoAuthor() != null) {
            Author coAuthor = authorRepository.findById(book.getCoAuthor().getIdAuthor())
                    .orElseThrow(() -> new NotFoundException(
                            "Co Author not found with id: " + book.getCoAuthor().getIdAuthor()));
            coAuthor.setBooksOwned(coAuthor.getBooksOwned() + 1);
            authorRepository.save(coAuthor);
        }
        BookCategory bookCategory = bookCategoryRepository.findById(book.getCategory().getIdBookCategorie())
                .orElseThrow(() -> new NotFoundException(
                        "Book category not found with id: " + book.getCategory().getIdBookCategorie()));
        bookCategory.setBooksCount(bookCategory.getBooksCount() + 1);
        bookCategoryRepository.save(bookCategory);
        bookRepository.save(book);
        log.info("Book '{}' saved successfully with ISBN {}", book.getTitle(), book.getIsbn());
    }

    @Override
    public void updateBook(Book book, String idBook) throws NotFoundException {
        Book existingBook = bookRepository.findById(idBook)
                .orElseThrow(() -> new NotFoundException("Book not found with id: " + idBook));

        // ----- Update basic fields -----
        Optional.ofNullable(book.getTitle()).ifPresent(existingBook::setTitle);
        Optional.ofNullable(book.getDescription()).ifPresent(existingBook::setDescription);
        Optional.ofNullable(book.getIsbn()).ifPresent(existingBook::setIsbn);
        Optional.ofNullable(book.getPublicationDate()).ifPresent(existingBook::setPublicationDate);
        Optional.ofNullable(book.getPublisher()).ifPresent(existingBook::setPublisher);
        Optional.ofNullable(book.getLanguage()).ifPresent(existingBook::setLanguage);
        Optional.ofNullable(book.getLocation()).ifPresent(existingBook::setLocation);
        Optional.ofNullable(book.getPages()).ifPresent(existingBook::setPages);
        Optional.ofNullable(book.getTimesBorrowed()).ifPresent(existingBook::setTimesBorrowed);
        Optional.ofNullable(book.getStatus()).ifPresent(existingBook::setStatus);

        // ----- Update Primary Author if changed -----
        if (book.getPrimaryAuthor() != null &&
                !book.getPrimaryAuthor().getIdAuthor().equals(existingBook.getPrimaryAuthor().getIdAuthor())) {
            Author oldPrimary = authorRepository.findById(existingBook.getPrimaryAuthor().getIdAuthor())
                    .orElseThrow(() -> new NotFoundException(
                            "Existing Primary Author not found with id: "
                                    + existingBook.getPrimaryAuthor().getIdAuthor()));
            Author newPrimary = authorRepository.findById(book.getPrimaryAuthor().getIdAuthor())
                    .orElseThrow(() -> new NotFoundException(
                            "New Primary Author not found with id: " + book.getPrimaryAuthor().getIdAuthor()));
            oldPrimary.setBooksOwned(oldPrimary.getBooksOwned() - 1);
            newPrimary.setBooksOwned(newPrimary.getBooksOwned() + 1);
            authorRepository.save(oldPrimary);
            authorRepository.save(newPrimary);
            existingBook.setPrimaryAuthor(newPrimary);
        }

        // ----- Update Co-Author if changed -----
        if (book.getCoAuthor() != null) {
            if (existingBook.getCoAuthor() == null ||
                    !book.getCoAuthor().getIdAuthor().equals(existingBook.getCoAuthor().getIdAuthor())) {
                if (existingBook.getCoAuthor() != null) {
                    Author oldCo = authorRepository.findById(existingBook.getCoAuthor().getIdAuthor())
                            .orElseThrow(() -> new NotFoundException(
                                    "Existing Co Author not found with id: "
                                            + existingBook.getCoAuthor().getIdAuthor()));
                    oldCo.setBooksOwned(oldCo.getBooksOwned() - 1);
                    authorRepository.save(oldCo);
                }
                Author newCo = authorRepository.findById(book.getCoAuthor().getIdAuthor())
                        .orElseThrow(() -> new NotFoundException(
                                "New Co Author not found with id: " + book.getCoAuthor().getIdAuthor()));
                newCo.setBooksOwned(newCo.getBooksOwned() + 1);
                authorRepository.save(newCo);
                existingBook.setCoAuthor(newCo);
            }
        }

        // ----- Update Book Category if changed -----
        if (book.getCategory() != null &&
                !book.getCategory().getIdBookCategorie().equals(existingBook.getCategory().getIdBookCategorie())) {
            BookCategory oldCategory = bookCategoryRepository.findById(existingBook.getCategory().getIdBookCategorie())
                    .orElseThrow(() -> new NotFoundException(
                            "Existing Book Category not found with id: "
                                    + existingBook.getCategory().getIdBookCategorie()));
            BookCategory newCategory = bookCategoryRepository.findById(book.getCategory().getIdBookCategorie())
                    .orElseThrow(() -> new NotFoundException(
                            "New Book Category not found with id: " + book.getCategory().getIdBookCategorie()));
            oldCategory.setBooksCount(oldCategory.getBooksCount() - 1);
            newCategory.setBooksCount(newCategory.getBooksCount() + 1);
            bookCategoryRepository.save(oldCategory);
            bookCategoryRepository.save(newCategory);
            existingBook.setCategory(newCategory);
        }
        bookRepository.save(existingBook);
        log.info("Book updated successfully: {}", existingBook.getIdBook());
    }

    @Override
    public List<Book> getAvailableBooks() {
        return bookRepository.findAll().stream()
                .filter(book -> book.getStatus() == BookStatus.AVAILABLE)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookLineChartResponseDTO> generateBookLineChart(String period) {
        List<Book> books = bookRepository.findAll();
        Set<BookCategory> allCategories = books.stream()
                .map(Book::getCategory)
                .collect(Collectors.toSet());
        Map<BookCategory, List<Integer>> categoryMap = new HashMap<>();
        Map<BookCategory, List<String>> labelMap = new HashMap<>();
        for (BookCategory cat : allCategories) {
            categoryMap.put(cat, new ArrayList<>());
            labelMap.put(cat, new ArrayList<>());
        }
        if (period == null || period.isEmpty()) {
            throw new IllegalArgumentException("Period must not be null or empty");
        }
        // --- CASE 1: ALL DATA ---
        if ("all".equalsIgnoreCase(period)) {
            Map<YearMonth, Map<BookCategory, Integer>> tempMap = new TreeMap<>();
            for (Book b : books) {
                YearMonth ym = YearMonth.from(b.getCreatedAt());
                tempMap.putIfAbsent(ym, new HashMap<>());
                Map<BookCategory, Integer> catCounts = tempMap.get(ym);
                BookCategory cat = b.getCategory();
                catCounts.put(cat, catCounts.getOrDefault(cat, 0) + 1);
            }
            for (Map.Entry<YearMonth, Map<BookCategory, Integer>> entry : tempMap.entrySet()) {
                YearMonth ym = entry.getKey();
                String label = ym.getMonth().name().substring(0, 3) + " " + ym.getYear();
                Map<BookCategory, Integer> counts = entry.getValue();
                for (BookCategory cat : allCategories) {
                    categoryMap.get(cat).add(counts.getOrDefault(cat, 0));
                    labelMap.get(cat).add(label);
                }
            }
        } else if (period.matches("\\d{4}")) {
            // --- CASE 2: YEAR only ---
            int year = Integer.parseInt(period);
            for (BookCategory cat : allCategories) {
                labelMap.put(cat, new ArrayList<>(Arrays.asList(
                        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")));
                categoryMap.put(cat, new ArrayList<>(Collections.nCopies(12, 0)));
            }
            for (Book b : books) {
                if (b.getCreatedAt().getYear() == year) {
                    BookCategory cat = b.getCategory();
                    int monthIndex = b.getCreatedAt().getMonthValue() - 1;
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
            for (BookCategory cat : allCategories) {
                labelMap.put(cat, new ArrayList<>());
                categoryMap.put(cat, new ArrayList<>(Collections.nCopies(daysInMonth, 0)));
                for (int d = 1; d <= daysInMonth; d++) {
                    labelMap.get(cat).add(String.valueOf(d));
                }
            }
            for (Book b : books) {
                if (b.getCreatedAt().getYear() == year && b.getCreatedAt().getMonthValue() == month) {
                    BookCategory cat = b.getCategory();
                    int dayIndex = b.getCreatedAt().getDayOfMonth() - 1;
                    categoryMap.get(cat).set(dayIndex, categoryMap.get(cat).get(dayIndex) + 1);
                }
            }
        } else {
            throw new IllegalArgumentException("Invalid period format. Use 'all', 'YYYY', or 'MMyyyy'");
        }
        List<BookLineChartResponseDTO> result = new ArrayList<>();
        for (BookCategory cat : allCategories) {
            result.add(new BookLineChartResponseDTO(
                    cat.getName(), // Use category name from DB
                    categoryMap.get(cat).stream().mapToInt(Integer::intValue).toArray(),
                    labelMap.get(cat).toArray(new String[0])));
        }

        return result;
    }

    @Override
    public List<BookBarChartResponseDTO> generateBookBarChart(String period) {
        List<Book> books = bookRepository.findAll();
        Map<String, List<Integer>> statusMap = new HashMap<>();
        Map<String, List<String>> labelMap = new HashMap<>();
        String[] bookStatuses = { "AVAILABLE", "BORROWED", "RESERVED" };
        for (String status : bookStatuses) {
            statusMap.put(status, new ArrayList<>());
            labelMap.put(status, new ArrayList<>());
        }
        if (period == null || period.isEmpty()) {
            throw new IllegalArgumentException("Period must not be null or empty");
        }
        // --- CASE 1: ALL DATA ---
        if ("all".equalsIgnoreCase(period)) {
            Map<YearMonth, Map<String, Integer>> tempMap = new TreeMap<>();
            for (Book b : books) {
                YearMonth ym = YearMonth.from(b.getCreatedAt());
                tempMap.putIfAbsent(ym, new HashMap<>());
                Map<String, Integer> counts = tempMap.get(ym);
                String status = b.getStatus().name();
                counts.put(status, counts.getOrDefault(status, 0) + 1);
            }
            for (Map.Entry<YearMonth, Map<String, Integer>> entry : tempMap.entrySet()) {
                YearMonth ym = entry.getKey();
                String label = ym.getMonth().name().substring(0, 3) + " " + ym.getYear();
                Map<String, Integer> counts = entry.getValue();

                for (String status : bookStatuses) {
                    statusMap.get(status).add(counts.getOrDefault(status, 0));
                    labelMap.get(status).add(label);
                }
            }
        } else if (period.matches("\\d{4}")) {
            // --- CASE 2: YEAR only ---
            int year = Integer.parseInt(period);
            for (String status : bookStatuses) {
                labelMap.put(status, new ArrayList<>(Arrays.asList(
                        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")));
                statusMap.put(status, new ArrayList<>(Collections.nCopies(12, 0)));
            }
            for (Book b : books) {
                if (b.getCreatedAt().getYear() == year) {
                    String status = b.getStatus().name();
                    int monthIndex = b.getCreatedAt().getMonthValue() - 1;
                    statusMap.get(status).set(monthIndex, statusMap.get(status).get(monthIndex) + 1);
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
            for (String status : bookStatuses) {
                labelMap.put(status, new ArrayList<>());
                statusMap.put(status, new ArrayList<>(Collections.nCopies(daysInMonth, 0)));
                for (int d = 1; d <= daysInMonth; d++) {
                    labelMap.get(status).add(String.valueOf(d));
                }
            }
            for (Book b : books) {
                if (b.getCreatedAt().getYear() == year && b.getCreatedAt().getMonthValue() == month) {
                    String status = b.getStatus().name();
                    int dayIndex = b.getCreatedAt().getDayOfMonth() - 1;
                    statusMap.get(status).set(dayIndex, statusMap.get(status).get(dayIndex) + 1);
                }
            }
        } else {
            throw new IllegalArgumentException("Invalid period format. Use 'all', 'YYYY', or 'MMyyyy'");
        }
        List<BookBarChartResponseDTO> result = new ArrayList<>();
        for (String status : bookStatuses) {
            result.add(new BookBarChartResponseDTO(
                    status,
                    statusMap.get(status).stream().mapToInt(Integer::intValue).toArray(),
                    labelMap.get(status).toArray(new String[0])));
        }
        return result;
    }

    @Override
    public List<BookDonutChartResponseDTO> generateBookDonutChart(String period) {
        List<Book> books = bookRepository.findAll();
        Map<Language, Integer> languageCount = new EnumMap<>(Language.class);
        for (Language l : Language.values()) {
            languageCount.put(l, 0);
        }
        for (Book b : books) {
            boolean include = false;
            if ("all".equalsIgnoreCase(period)) {
                include = true;
            } else if (period.matches("\\d{4}")) {
                int year = Integer.parseInt(period);
                include = b.getCreatedAt().getYear() == year;
            } else if (period.matches("\\d{6}")) {
                int month = Integer.parseInt(period.substring(0, 2));
                int year = Integer.parseInt(period.substring(2));
                include = b.getCreatedAt().getYear() == year && b.getCreatedAt().getMonthValue() == month;
            } else {
                throw new IllegalArgumentException("Invalid period format. Use 'all', 'YYYY', or 'MMyyyy'");
            }
            if (include) {
                Language language = b.getLanguage();
                languageCount.put(language, languageCount.getOrDefault(language, 0) + 1);
            }
        }
        List<BookDonutChartResponseDTO> result = new ArrayList<>();
        for (Language l : Language.values()) {
            result.add(new BookDonutChartResponseDTO(l.name(), languageCount.get(l)));
        }

        return result;
    }

}
