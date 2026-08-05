package com.foodexpress.backend.controller;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.foodexpress.backend.model.MenuItem;
import com.foodexpress.backend.repository.MenuItemRepository;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:5177",
        "https://food-express-henna.vercel.app"
})
public class MenuItemController {

    private final MenuItemRepository menuItemRepository;

    public MenuItemController(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    // Add Menu Item
    @PostMapping
    public MenuItem addMenuItem(@RequestBody MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }

    // Get All Menu Items
    @GetMapping
    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    // Get Menu Items by Restaurant ID
    @GetMapping("/restaurant/{restaurantId}")
    public List<MenuItem> getMenuByRestaurant(
            @PathVariable String restaurantId) {

        return menuItemRepository.findByRestaurantId(restaurantId);
    }

    // ⭐ AI Recommendations
    @GetMapping("/recommendations/{restaurantId}")
    public List<MenuItem> getRecommendations(
            @PathVariable String restaurantId) {

        return menuItemRepository
                .findByRestaurantId(restaurantId)
                .stream()
                .filter(MenuItem::isAvailable)
                .sorted(
                        Comparator.comparing(MenuItem::getPrice)
                )
                .limit(4)
                .collect(Collectors.toList());
    }

    // Update Menu Item
    @PutMapping("/{id}")
    public MenuItem updateMenuItem(
            @PathVariable String id,
            @RequestBody MenuItem updatedMenuItem) {

        Optional<MenuItem> menuItem =
                menuItemRepository.findById(id);

        if (menuItem.isPresent()) {

            MenuItem existing = menuItem.get();

            existing.setRestaurantId(
                    updatedMenuItem.getRestaurantId());
            existing.setName(updatedMenuItem.getName());
            existing.setDescription(
                    updatedMenuItem.getDescription());
            existing.setPrice(updatedMenuItem.getPrice());
            existing.setCategory(updatedMenuItem.getCategory());
            existing.setAvailable(
                    updatedMenuItem.isAvailable());
                existing.setImageUrl(updatedMenuItem.getImageUrl());
            return menuItemRepository.save(existing);
        }

        return null;
    }

    // Delete Menu Item
    @DeleteMapping("/{id}")
    public String deleteMenuItem(
            @PathVariable String id) {

        menuItemRepository.deleteById(id);

        return "Menu Item Deleted Successfully";
    }
}