package com.foodexpress.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    private String customerId;

    // Customer Details
    private String customerName;
    private String customerEmail;
    private String phone;
    private String address;
    private String paymentMethod;
    private String paymentId;

    // Coupon Details
    private String couponCode;
    private double discountAmount;
    private double finalAmount;

    // Order Date & Time
    private String orderDate;

    // Order Details
    private String foodName;
    private double price;
    private int quantity;
    private double total;
    private String status;

    public Order() {
    }

    public Order(
            String customerId,
            String customerName,
            String customerEmail,
            String phone,
            String address,
            String paymentMethod,
            String paymentId,
            String couponCode,
            double discountAmount,
            double finalAmount,
            String orderDate,
            String foodName,
            double price,
            int quantity,
            double total,
            String status) {

        this.customerId = customerId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.phone = phone;
        this.address = address;
        this.paymentMethod = paymentMethod;
        this.paymentId = paymentId;
        this.couponCode = couponCode;
        this.discountAmount = discountAmount;
        this.finalAmount = finalAmount;
        this.orderDate = orderDate;
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

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getCouponCode() {
        return couponCode;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }

    public double getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(double discountAmount) {
        this.discountAmount = discountAmount;
    }

    public double getFinalAmount() {
        return finalAmount;
    }

    public void setFinalAmount(double finalAmount) {
        this.finalAmount = finalAmount;
    }

    public String getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(String orderDate) {
        this.orderDate = orderDate;
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