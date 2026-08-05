package com.foodexpress.backend.dto;

public class CartResponse {

    private String id;
    private String customerId;
    private String menuItemId;
    private String foodName;
    private double price;
    private int quantity;

    public CartResponse() {
    }

    public CartResponse(
            String id,
            String customerId,
            String menuItemId,
            String foodName,
            double price,
            int quantity) {

        this.id = id;
        this.customerId = customerId;
        this.menuItemId = menuItemId;
        this.foodName = foodName;
        this.price = price;
        this.quantity = quantity;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getMenuItemId() {
        return menuItemId;
    }

    public void setMenuItemId(String menuItemId) {
        this.menuItemId = menuItemId;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}