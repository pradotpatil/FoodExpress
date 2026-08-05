import { useState } from "react";
import api from "../services/api";

function SeedData() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const restaurants = [
    {
      name: "Pizza Hut",
      address: "FC Road, Pune",
      cuisine: "Pizza",
      rating: 4.6,
      menu: [
        {
          name: "Margherita Pizza",
          description: "Classic cheese and tomato pizza",
          price: 249,
          category: "Pizza",
        },
        {
          name: "Paneer Pizza",
          description: "Pizza with paneer and vegetables",
          price: 299,
          category: "Pizza",
        },
        {
          name: "Farmhouse Pizza",
          description: "Pizza loaded with fresh vegetables",
          price: 349,
          category: "Pizza",
        },
        {
          name: "Garlic Bread",
          description: "Fresh baked garlic bread",
          price: 149,
          category: "Sides",
        },
        {
          name: "Choco Lava Cake",
          description: "Chocolate cake with molten centre",
          price: 129,
          category: "Dessert",
        },
      ],
    },
    {
      name: "Domino's",
      address: "Kothrud, Pune",
      cuisine: "Pizza",
      rating: 4.5,
      menu: [
        {
          name: "Veg Extravaganza",
          description: "Vegetable pizza loaded with cheese",
          price: 399,
          category: "Pizza",
        },
        {
          name: "Cheese Burst Pizza",
          description: "Pizza with extra cheese-filled crust",
          price: 449,
          category: "Pizza",
        },
        {
          name: "Veg Loaded Pizza",
          description: "Pizza topped with assorted vegetables",
          price: 329,
          category: "Pizza",
        },
        {
          name: "Stuffed Garlic Bread",
          description: "Garlic bread stuffed with cheese",
          price: 199,
          category: "Sides",
        },
        {
          name: "Pepsi",
          description: "Chilled soft drink",
          price: 60,
          category: "Drinks",
        },
      ],
    },
    {
      name: "Burger King",
      address: "JM Road, Pune",
      cuisine: "Fast Food",
      rating: 4.4,
      menu: [
        {
          name: "Veg Whopper",
          description: "Large vegetable burger",
          price: 199,
          category: "Burger",
        },
        {
          name: "Chicken Whopper",
          description: "Large chicken burger",
          price: 249,
          category: "Burger",
        },
        {
          name: "Crispy Veg Burger",
          description: "Burger with crispy vegetable patty",
          price: 149,
          category: "Burger",
        },
        {
          name: "French Fries",
          description: "Crispy salted potato fries",
          price: 119,
          category: "Sides",
        },
        {
          name: "Coke",
          description: "Chilled soft drink",
          price: 50,
          category: "Drinks",
        },
      ],
    },
    {
      name: "KFC",
      address: "Viman Nagar, Pune",
      cuisine: "Chicken",
      rating: 4.7,
      menu: [
        {
          name: "Chicken Bucket",
          description: "Bucket of crispy fried chicken",
          price: 599,
          category: "Chicken",
        },
        {
          name: "Hot Wings",
          description: "Spicy crispy chicken wings",
          price: 249,
          category: "Chicken",
        },
        {
          name: "Chicken Popcorn",
          description: "Bite-sized crispy chicken pieces",
          price: 199,
          category: "Chicken",
        },
        {
          name: "Zinger Burger",
          description: "Crispy chicken burger with sauce",
          price: 229,
          category: "Burger",
        },
        {
          name: "Pepsi",
          description: "Chilled soft drink",
          price: 60,
          category: "Drinks",
        },
      ],
    },
    {
      name: "Biryani House",
      address: "Camp, Pune",
      cuisine: "Indian",
      rating: 4.8,
      menu: [
        {
          name: "Chicken Biryani",
          description: "Aromatic rice with chicken and spices",
          price: 349,
          category: "Biryani",
        },
        {
          name: "Veg Biryani",
          description: "Aromatic rice with vegetables",
          price: 249,
          category: "Biryani",
        },
        {
          name: "Paneer Biryani",
          description: "Aromatic rice cooked with paneer",
          price: 299,
          category: "Biryani",
        },
        {
          name: "Butter Chicken",
          description: "Creamy chicken curry",
          price: 399,
          category: "Main Course",
        },
        {
          name: "Gulab Jamun",
          description: "Sweet dumplings in sugar syrup",
          price: 99,
          category: "Dessert",
        },
      ],
    },
    {
      name: "Cafe Coffee Day",
      address: "Baner, Pune",
      cuisine: "Cafe and Beverages",
      rating: 4.5,
      menu: [
        {
          name: "Cappuccino",
          description: "Hot coffee with milk foam",
          price: 180,
          category: "Drinks",
        },
        {
          name: "Cold Coffee",
          description: "Chilled creamy coffee",
          price: 220,
          category: "Drinks",
        },
        {
          name: "Latte",
          description: "Smooth coffee with steamed milk",
          price: 190,
          category: "Drinks",
        },
        {
          name: "Chocolate Brownie",
          description: "Rich chocolate brownie",
          price: 160,
          category: "Dessert",
        },
        {
          name: "Veg Sandwich",
          description: "Grilled vegetable sandwich",
          price: 180,
          category: "Snacks",
        },
      ],
    },
  ];

  const addAllData = async () => {
    setLoading(true);
    setMessage("");

    try {
      for (const restaurant of restaurants) {
        const restaurantResponse = await api.post(
          "/restaurants",
          {
            name: restaurant.name,
            address: restaurant.address,
            cuisine: restaurant.cuisine,
            rating: restaurant.rating,
          }
        );

        const restaurantId = restaurantResponse.data.id;

        for (const food of restaurant.menu) {
          await api.post("/menu", {
            restaurantId,
            name: food.name,
            description: food.description,
            price: food.price,
            category: food.category,
            available: true,
          });
        }
      }

      setMessage(
        "6 restaurants and 30 food items added successfully!"
      );
    } catch (error) {
      console.error(
        "Error adding sample data:",
        error.response?.data || error.message
      );

      setMessage(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to add data. Check Render logs and browser console."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "70vh",
        padding: "60px 20px",
        background: "#f5f5f5",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "40px 30px",
          textAlign: "center",
          background: "#ffffff",
          borderRadius: "15px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.12)",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            marginBottom: "15px",
          }}
        >
          Add FoodExpress Sample Data
        </h1>

        <p>
          This will add 6 restaurants and 30 food items.
        </p>

        <button
          type="button"
          onClick={addAllData}
          disabled={loading}
          style={{
            marginTop: "20px",
            padding: "14px 30px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: loading
              ? "#999999"
              : "#ff512f",
            color: "#ffffff",
            fontSize: "17px",
            cursor: loading
              ? "not-allowed"
              : "pointer",
          }}
        >
          {loading
            ? "Adding Data..."
            : "Add All Restaurants and Foods"}
        </button>

        {message && (
          <h3
            style={{
              marginTop: "25px",
              color: message.includes("successfully")
                ? "green"
                : "red",
            }}
          >
            {message}
          </h3>
        )}
      </div>
    </main>
  );
}

export default SeedData;