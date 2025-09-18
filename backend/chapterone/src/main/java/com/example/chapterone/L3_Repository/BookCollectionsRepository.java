package com.example.chapterone.L3_Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.chapterone.L4_Model.Entites.BookCollections;

public interface BookCollectionsRepository  extends MongoRepository<BookCollections, String>{

}
