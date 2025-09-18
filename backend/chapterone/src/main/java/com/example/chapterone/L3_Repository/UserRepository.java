package com.example.chapterone.L3_Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.chapterone.L4_Model.Entites.User;

public interface UserRepository extends MongoRepository<User, String> {

}
