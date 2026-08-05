package com.foodexpress.backend.dto;

public class OrderResponse {

    private String id;
    private String customerId;
    private String foodName;
    private double price;
    private int quantity;
    private double total;
    private String status;

    public OrderResponse() {
    }

    public OrderResponse(String id, String customerId,
                         String foodName, double price,
                         int quantity, double total,
                         String status) {

        this.id = id;
        this.customerId = customerId;
        this.foodName = foodName;
        this.price = price;
        this.quantity = quantity;
        this.total = total;
        this.status = status;
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

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}