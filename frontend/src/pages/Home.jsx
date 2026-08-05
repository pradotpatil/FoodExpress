import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { addToCart } from "../services/cartService";

function Home() {
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);
  const [addingItem, setAddingItem] = useState("");

  const categories = [
    { name: "Pizza", icon: "🍕" },
    { name: "Burger", icon: "🍔" },
    { name: "Chicken", icon: "🍗" },
    { name: "Salad", icon: "🥗" },
    { name: "Dessert", icon: "🍰" },
    { name: "Drinks", icon: "🥤" },
  ];

  const popularDishes = [
    {
      name: "Paneer Pizza",
      price: 299,
      rating: "4.8",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
    },
    {
      name: "Veg Burger",
      price: 199,
      rating: "4.7",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
    },
    {
      name: "Chicken Biryani",
      price: 349,
      rating: "4.9",
      image:
        "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800",
    },
    {
      name: "Pasta",
      price: 249,
      rating: "4.6",
      image:
        "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800",
    },
  ];

  const loadMenuItems = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/menu"
      );

      setMenuItems(response.data);
    } catch (error) {
      console.error("Error loading menu items:", error);
    }
  };

  useEffect(() => {
    loadMenuItems();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate("/restaurants", {
      state: {
        category: categoryName,
      },
    });
  };

  const handleAddToCart = async (food) => {
    try {
      setAddingItem(food.name);

      const matchingMenuItem = menuItems.find(
        (item) =>
          item.name?.toLowerCase().trim() ===
          food.name.toLowerCase().trim()
      );

      if (!matchingMenuItem) {
        alert(
          `${food.name} is not available in the menu database.`
        );

        return;
      }

      const cartItem = {
        customerId: "customer1",
        menuItemId: matchingMenuItem.id,
        quantity: 1,
      };

      await addToCart(cartItem);

      alert(`${food.name} added to cart successfully!`);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert("Failed to add item to cart.");
    } finally {
      setAddingItem("");
    }
  };

  return (
    <div>
      {/* Hero Section */}

      <section
        style={{
          minHeight: "80vh",
          background:
            "linear-gradient(to right, #ff512f, #dd2476)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#ffffff",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <h1
          style={{
            fontSize: "60px",
            marginBottom: "20px",
          }}
        >
          FoodExpress
        </h1>

        <h2
          style={{
            fontWeight: "normal",
            marginBottom: "25px",
          }}
        >
          Delicious Food Delivered To Your Doorstep
        </h2>

        <input
          type="text"
          placeholder="Search food or restaurants..."
          style={{
            width: "500px",
            maxWidth: "90%",
            padding: "15px 20px",
            borderRadius: "30px",
            border: "none",
            fontSize: "16px",
            marginBottom: "25px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={() => navigate("/restaurants")}
          style={{
            padding: "15px 40px",
            border: "none",
            borderRadius: "30px",
            background: "#ffffff",
            color: "#ff512f",
            fontSize: "18px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Explore Restaurants
        </button>
      </section>

      {/* Food Categories */}

      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "35px",
            marginBottom: "10px",
          }}
        >
          Explore Food Categories
        </h2>

        <p
          style={{
            color: "#666666",
            marginBottom: "35px",
          }}
        >
          Choose your favourite category and start ordering
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "20px",
          }}
        >
          {categories.map((category) => (
            <div
              key={category.name}
              onClick={() =>
                handleCategoryClick(category.name)
              }
              style={{
                padding: "30px 15px",
                borderRadius: "15px",
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.transform =
                  "translateY(-8px)";

                event.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(0,0,0,0.18)";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.transform =
                  "translateY(0)";

                event.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(0,0,0,0.1)";
              }}
            >
              <div
                style={{
                  fontSize: "55px",
                  marginBottom: "15px",
                }}
              >
                {category.icon}
              </div>

              <h3
                style={{
                  margin: 0,
                  fontSize: "20px",
                }}
              >
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Dishes */}

      <section
        style={{
          background: "#f8f9fa",
          padding: "60px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: "36px",
              marginBottom: "10px",
            }}
          >
            Popular Dishes
          </h2>

          <p
            style={{
              textAlign: "center",
              color: "#666666",
              marginBottom: "40px",
            }}
          >
            Most loved dishes by our customers
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "25px",
            }}
          >
            {popularDishes.map((food) => (
              <div
                key={food.name}
                style={{
                  background: "#ffffff",
                  borderRadius: "15px",
                  overflow: "hidden",
                  boxShadow:
                    "0 6px 15px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={food.image}
                  alt={food.name}
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                  }}
                />

                <div style={{ padding: "20px" }}>
                  <h3>{food.name}</h3>

                  <p>⭐ {food.rating}</p>

                  <h3 style={{ color: "#ff512f" }}>
                    ₹{food.price}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "10px",
                      marginTop: "20px",
                    }}
                  >
                    <button
                      onClick={() =>
                        handleAddToCart(food)
                      }
                      disabled={addingItem === food.name}
                      style={{
                        flex: 1,
                        background:
                          addingItem === food.name
                            ? "#999999"
                            : "#ff512f",
                        color: "#ffffff",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "8px",
                        cursor:
                          addingItem === food.name
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {addingItem === food.name
                        ? "Adding..."
                        : "Add to Cart"}
                    </button>

                    <button
                      style={{
                        border: "1px solid #dddddd",
                        background: "#ffffff",
                        borderRadius: "8px",
                        padding: "10px 15px",
                        cursor: "pointer",
                      }}
                    >
                      ❤️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;