package com.foodexpress.backend.controller;

import java.util.ArrayList;
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

import com.foodexpress.backend.dto.CartResponse;
import com.foodexpress.backend.model.Cart;
import com.foodexpress.backend.model.MenuItem;
import com.foodexpress.backend.repository.CartRepository;
import com.foodexpress.backend.repository.MenuItemRepository;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins ={ "http://localhost:5173",
                            "http://localhost:5174",
                             "http://localhost:5175",
                             "http://localhost:5176",
                            "http://localhost:5177"

})public class CartController {

    private final CartRepository cartRepository;
    private final MenuItemRepository menuItemRepository;

    public CartController(
            CartRepository cartRepository,
            MenuItemRepository menuItemRepository) {

        this.cartRepository = cartRepository;
        this.menuItemRepository = menuItemRepository;
    }

    @PostMapping
    public Cart addToCart(@RequestBody Cart cart) {
        return cartRepository.save(cart);
    }

    @GetMapping
    public List<Cart> getAllCartItems() {
        return cartRepository.findAll();
    }

    @GetMapping("/customer/{customerId}")
    public List<CartResponse> getCartByCustomer(
            @PathVariable String customerId) {

        List<Cart> cartItems =
                cartRepository.findByCustomerId(customerId);

        List<CartResponse> cartResponses = new ArrayList<>();

        for (Cart cartItem : cartItems) {

            Optional<MenuItem> menuItem =
                    menuItemRepository.findById(
                            cartItem.getMenuItemId());

            if (menuItem.isPresent()) {

                MenuItem food = menuItem.get();

                CartResponse response = new CartResponse(
                        cartItem.getId(),
                        cartItem.getCustomerId(),
                        cartItem.getMenuItemId(),
                        food.getName(),
                        food.getPrice(),
                        cartItem.getQuantity()
                );

                cartResponses.add(response);
            }
        }

        return cartResponses;
    }

    @PutMapping("/{id}")
    public Cart updateCartItem(
            @PathVariable String id,
            @RequestBody Cart updatedCart) {

        Optional<Cart> cartItem =
                cartRepository.findById(id);

        if (cartItem.isPresent()) {

            Cart existing = cartItem.get();

            existing.setCustomerId(
                    updatedCart.getCustomerId());

            existing.setMenuItemId(
                    updatedCart.getMenuItemId());

            existing.setQuantity(
                    updatedCart.getQuantity());

            return cartRepository.save(existing);
        }

        return null;
    }

    @DeleteMapping("/{id}")
    public String removeCartItem(
            @PathVariable String id) {

        cartRepository.deleteById(id);

        return "Cart Item Removed Successfully";
    }
}