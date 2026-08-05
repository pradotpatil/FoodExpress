package com.foodexpress.backend.model;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
@Document(collection = "cart")
public class Cart {
    @Id
private String id;

private String customerId;
private String menuItemId;
private int quantity;
public Cart() {
}
public Cart(String customerId,
            String menuItemId,
            int quantity) {

    this.customerId = customerId;
    this.menuItemId = menuItemId;
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

public int getQuantity() {
    return quantity;
}

public void setQuantity(int quantity) {
    this.quantity = quantity;
}
}

