package com.example.chapterone.L2_Service.Author;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;

import com.example.chapterone.L3_Repository.AuthorRepository;
import com.example.chapterone.L4_Model.Entites.Author;
import com.example.chapterone.L6_Exception.NotFoundException;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AuthorServiceImpl implements AuthorService {
    @Autowired
    private AuthorRepository authorRepository;

    @Override
    public void createAuthor(Author author) {
        boolean authorExists = authorRepository.findAll()
                .stream()
                .anyMatch(a -> a.getName().equalsIgnoreCase(author.getName()));

        if (authorExists) {
            throw new IllegalArgumentException("Author with name '" + author.getName() + "' already exists.");
        }

        author.setBooksOwned(0);
        authorRepository.save(author);
    }

    @Override
    public void updateAuthor(Author author, String idAuthor) throws NotFoundException {
        Author existingAuthor = authorRepository.findById(idAuthor)
                .orElseThrow(() -> new NotFoundException("Author not found with id: " + idAuthor));

        Optional.ofNullable(author.getName()).ifPresent(existingAuthor::setName);
        Optional.ofNullable(author.getBooksOwned()).ifPresent(existingAuthor::setBooksOwned);
        authorRepository.save(existingAuthor);
        log.info("Author updated successfully: {}", existingAuthor.getIdAuthor());
    }

    @Override
    public void deleteAuthor(String idAuthor) throws NotFoundException {
        Author existingAuthor = authorRepository.findById(idAuthor)
                .orElseThrow(() -> new NotFoundException("Author not found with id: " + idAuthor));
        authorRepository.delete(existingAuthor);
    }

    @Override
    public List<Author> getAllAuthors() {
        return authorRepository.findAll(Sort.by(Sort.Direction.ASC, "name"));
    }

}
