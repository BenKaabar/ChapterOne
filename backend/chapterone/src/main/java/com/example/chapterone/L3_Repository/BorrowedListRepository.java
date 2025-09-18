package com.example.chapterone.L3_Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.chapterone.L4_Model.Entites.BorrowedList;
import com.example.chapterone.L4_Model.Enums.BorrowStatus;

public interface BorrowedListRepository extends MongoRepository<BorrowedList, String> {
    List<BorrowedList> findByStatus(BorrowStatus status);

    @Query("{ 'borrowDate' : { $gte: ?0, $lte: ?1 } }")
    List<BorrowedList> findByBorrowDateBetween(LocalDate start, LocalDate end);
}
