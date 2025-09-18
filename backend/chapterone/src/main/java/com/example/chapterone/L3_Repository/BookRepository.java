package com.example.chapterone.L3_Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.chapterone.L4_Model.Entites.Book;

public interface BookRepository  extends MongoRepository<Book, String>{

}
