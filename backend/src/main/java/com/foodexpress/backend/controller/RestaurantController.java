package com.foodexpress.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodexpress.backend.model.Restaurant;
import com.foodexpress.backend.repository.RestaurantRepository;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
         "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5177"
})
public class RestaurantController {

    private final RestaurantRepository restaurantRepository;

    public RestaurantController(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    @PostMapping
    public Restaurant addRestaurant(@RequestBody Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    @GetMapping
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    @GetMapping("/{id}")
    public Restaurant getRestaurantById(@PathVariable String id) {
        return restaurantRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Restaurant updateRestaurant(
            @PathVariable String id,
            @RequestBody Restaurant updatedRestaurant) {

        Optional<Restaurant> restaurant = restaurantRepository.findById(id);

        if (restaurant.isPresent()) {

            Restaurant existing = restaurant.get();

            existing.setName(updatedRestaurant.getName());
            existing.setAddress(updatedRestaurant.getAddress());
            existing.setCuisine(updatedRestaurant.getCuisine());
            existing.setRating(updatedRestaurant.getRating());
            existing.setImageUrl(updatedRestaurant.getImageUrl());
            return restaurantRepository.save(existing);
        }

        return null;
    }

    @DeleteMapping("/{id}")
    public String deleteRestaurant(@PathVariable String id) {

        restaurantRepository.deleteById(id);

        return "Restaurant Deleted Successfully";
    }
}