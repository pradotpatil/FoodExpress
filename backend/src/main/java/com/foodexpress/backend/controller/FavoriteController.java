package com.foodexpress.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodexpress.backend.model.Favorite;
import com.foodexpress.backend.repository.FavoriteRepository;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177"
})
public class FavoriteController {

    private final FavoriteRepository favoriteRepository;

    public FavoriteController(
            FavoriteRepository favoriteRepository) {

        this.favoriteRepository = favoriteRepository;
    }

    // Add restaurant to favorites
    @PostMapping
    public Favorite addFavorite(
            @RequestBody Favorite favorite) {

        Optional<Favorite> existingFavorite =
                favoriteRepository
                        .findByCustomerIdAndRestaurantId(
                                favorite.getCustomerId(),
                                favorite.getRestaurantId()
                        );

        if (existingFavorite.isPresent()) {
            return existingFavorite.get();
        }

        return favoriteRepository.save(favorite);
    }

    // Get all favorites of one customer
    @GetMapping("/customer/{customerId}")
    public List<Favorite> getCustomerFavorites(
            @PathVariable String customerId) {

        return favoriteRepository
                .findByCustomerId(customerId);
    }

    // Check whether a restaurant is favorite
    @GetMapping(
        "/customer/{customerId}/restaurant/{restaurantId}"
    )
    public boolean isFavorite(
            @PathVariable String customerId,
            @PathVariable String restaurantId) {

        return favoriteRepository
                .findByCustomerIdAndRestaurantId(
                        customerId,
                        restaurantId
                )
                .isPresent();
    }

    // Remove restaurant from favorites
    @DeleteMapping(
        "/customer/{customerId}/restaurant/{restaurantId}"
    )
    public String removeFavorite(
            @PathVariable String customerId,
            @PathVariable String restaurantId) {

        Optional<Favorite> existingFavorite =
                favoriteRepository
                        .findByCustomerIdAndRestaurantId(
                                customerId,
                                restaurantId
                        );

        if (existingFavorite.isEmpty()) {
            return "Favorite not found";
        }

        favoriteRepository.delete(
                existingFavorite.get()
        );

        return "Favorite removed successfully";
    }
}