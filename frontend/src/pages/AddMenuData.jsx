import { useState } from "react";
import axios from "axios";

const MENU_API = "http://localhost:8080/api/menu";

function AddMenuData() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const menuItems = [
    // Pizza Hut
    {
      restaurantId: "6a5f7b292e7d48bafcb54ccd",
      name: "Margherita Pizza",
      description: "Classic cheese and tomato pizza",
      price: 249,
      category: "Pizza",
      available: true,
    },
    {
      restaurantId: "6a5f7b292e7d48bafcb54ccd",
      name: "Paneer Pizza",
      description: "Pizza with paneer, cheese and vegetables",
      price: 299,
      category: "Pizza",
      available: true,
    },
    {
      restaurantId: "6a5f7b292e7d48bafcb54ccd",
      name: "Farmhouse Pizza",
      description: "Pizza loaded with fresh vegetables",
      price: 349,
      category: "Pizza",
      available: true,
    },
    {
      restaurantId: "6a5f7b292e7d48bafcb54ccd",
      name: "Garlic Bread",
      description: "Freshly baked garlic bread",
      price: 149,
      category: "Sides",
      available: true,
    },
    {
      restaurantId: "6a5f7b292e7d48bafcb54ccd",
      name: "Choco Lava Cake",
      description: "Chocolate cake with a molten centre",
      price: 129,
      category: "Dessert",
      available: true,
    },

    // Domino's
    {
      restaurantId: "6a5f7b292e7d48bafcb54cd3",
      name: "Veg Extravaganza",
      description: "Vegetable pizza loaded with cheese",
      price: 399,
      category: "Pizza",
      available: true,
    },
    {
      restaurantId: "6a5f7b292e7d48bafcb54cd3",
      name: "Cheese Burst Pizza",
      description: "Pizza with extra cheese-filled crust",
      price: 449,
      category: "Pizza",
      available: true,
    },
    {
      restaurantId: "6a5f7b292e7d48bafcb54cd3",
      name: "Veg Loaded Pizza",
      description: "Pizza topped with assorted vegetables",
      price: 329,
      category: "Pizza",
      available: true,
    },
    {
      restaurantId: "6a5f7b292e7d48bafcb54cd3",
      name: "Stuffed Garlic Bread",
      description: "Garlic bread stuffed with cheese",
      price: 199,
      category: "Sides",
      available: true,
    },
    {
      restaurantId: "6a5f7b292e7d48bafcb54cd3",
      name: "Pepsi",
      description: "Chilled soft drink",
      price: 60,
      category: "Drinks",
      available: true,
    },

    // Burger King
    {
      restaurantId: "6a5f7b292e7d48bafcb54cd9",
      name: "Veg Whopper",
      description: "Large vegetable burger with fresh toppings",
      price: 199,
      category: "Burger",
      available: true,
    },
    {
      restaurantId: "6a5f7b292e7d48bafcb54cd9",
      name: "Chicken Whopper",
      description: "Large chicken burger with fresh toppings",
      price: 249,
      category: "Burger",
      available: true,
    },
    {
      restaurantId: "6a5f7b292e7d48bafcb54cd9",
      name: "Crispy Veg Burger",
      description: "Burger with a crispy vegetable patty",
      price: 149,
      category: "Burger",
      available: true,
    },
    {
      restaurantId: "6a5f7b292e7d48bafcb54cd9",
      name: "French Fries",
      description: "Crispy salted potato fries",
      price: 119,
      category: "Sides",
      available: true,
    },
    {
      restaurantId: "6a5f7b292e7d48bafcb54cd9",
      name: "Coke",
      description: "Chilled soft drink",
      price: 50,
      category: "Drinks",
      available: true,
    },

    // KFC
    {
      restaurantId: "6a5f7b292e7d48bafcb54cdf",
      name: "Chicken Bucket",
      description: "Bucket of crispy fried chicken",
      price: 599,
      category: "Chicken",
      available: true,
    },
    {
      restaurantId: "6a5f7b292e7d48bafcb54cdf",
      name: "Hot Wings",
      description: "Spicy and crispy chicken wings",
      price: 249,
      category: "Chicken",
      available: true,
    },
    {
      restaurantId: "6a5f7b292e7d48bafcb54cdf",
      name: "Chicken Popcorn",
      description: "Bite-sized crispy chicken pieces",
      price: 199,
      category: "Chicken",
      available: true,
    },
    {
      restaurantId: "6a5f7b292e7d48bafcb54cdf",
      name: "Zinger Burger",
      description: "Crispy chicken burger with sauce",
      price: 229,
      category: "Burger",
      available: true,
    },
    {
      restaurantId: "6a5f7b292e7d48bafcb54cdf",
      name: "Pepsi",
      description: "Chilled soft drink",
      price: 60,
      category: "Drinks",
      available: true,
    },

    // Biryani House
    {
      restaurantId: "6a5f7b292e7d48bafcb54ce5",
      name: "Chicken Biryani",
      description: "Aromatic rice cooked with chicken and spices",
      price: 349,
      category: "Biryani",
      available: true,
    },
    {
      restaurantId: "6a5f7b292e7d48bafcb54ce5",
      name: "Veg Biryani",
      description: "Aromatic rice cooked with vegetables",
      price: 249,
      category: "Biryani",
      available: true,
    },
    {
      restaurantId: "6a5f7b292e7d48bafcb54ce5",
      name: "Paneer Biryani",
      description: "Aromatic rice cooked with paneer",
      price: 299,
      category: "Biryani",
      available: true,
    },
    {
      restaurantId: "6a5f7b292e7d48bafcb54ce5",
      name: "Butter Chicken",
      description: "Creamy chicken curry with rich gravy",
      price: 399,
      category: "Main Course",
      available: true,
    },
    {
      restaurantId: "6a5f7b292e7d48bafcb54ce5",
      name: "Gulab Jamun",
      description: "Sweet dumplings served in sugar syrup",
      price: 99,
      category: "Dessert",
      available: true,
    },

    // Cafe Coffee Day
    {
      restaurantId: "6a5f7b292e7d48bafcb54ceb",
      name: "Cappuccino",
      description: "Hot coffee with steamed milk foam",
      price: 180,
      category: "Drinks",
      available: true,
    },
    {
      restaurantId: "6a5f7b292e7d48bafcb54ceb",
      name: "Cold Coffee",
      description: "Chilled creamy coffee",
      price: 220,
      category: "Drinks",
      available: true,
    },
    {
      restaurantId: "6a5f7b292e7d48bafcb54ceb",
      name: "Latte",
      description: "Smooth coffee with steamed milk",
      price: 190,
      category: "Drinks",
      available: true,
    },
    {
      restaurantId: "6a5f7b292e7d48bafcb54ceb",
      name: "Chocolate Brownie",
      description: "Rich chocolate brownie",
      price: 160,
      category: "Dessert",
      available: true,
    },
    {
      restaurantId: "6a5f7b292e7d48bafcb54ceb",
      name: "Veg Sandwich",
      description: "Grilled sandwich filled with vegetables",
      price: 180,
      category: "Snacks",
      available: true,
    },
  ];

  const addAllMenuItems = async () => {
    setLoading(true);
    setMessage("");

    try {
      const existingResponse = await axios.get(MENU_API);
      const existingItems = existingResponse.data;

      let addedCount = 0;
      let skippedCount = 0;

      for (const item of menuItems) {
        const alreadyExists = existingItems.some(
          (existingItem) =>
            existingItem.restaurantId === item.restaurantId &&
            existingItem.name.toLowerCase() === item.name.toLowerCase()
        );

        if (alreadyExists) {
          skippedCount++;
        } else {
          await axios.post(MENU_API, item);
          addedCount++;
        }
      }

      setMessage(
        `${addedCount} menu items added. ${skippedCount} duplicate items skipped.`
      );
    } catch (error) {
      console.error("Error adding menu items:", error);

      setMessage(
        "Failed to add menu items. Check backend and browser console."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "60px auto",
        padding: "35px",
        textAlign: "center",
        backgroundColor: "#ffffff",
        borderRadius: "15px",
        boxShadow: "0 5px 20px rgba(0,0,0,0.12)",
      }}
    >
      <h1>Add Restaurant Menu Items</h1>

      <p>
        This will add 30 menu items to the correct restaurants.
      </p>

      <button
        onClick={addAllMenuItems}
        disabled={loading}
        style={{
          padding: "14px 30px",
          marginTop: "20px",
          border: "none",
          borderRadius: "8px",
          backgroundColor: loading ? "#999999" : "#ff4d4d",
          color: "#ffffff",
          fontSize: "17px",
          fontWeight: "bold",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Adding Menu Items..." : "Add All Menu Items"}
      </button>

      {message && (
        <p
          style={{
            marginTop: "25px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default AddMenuData;