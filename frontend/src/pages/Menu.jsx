import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../services/api";
import { addToCart } from "../services/cartService";
import { getRecommendations } from "../services/recommendationService";

import "./Menu.css";

function Menu() {
  const { restaurantId } = useParams();

  const [menuItems, setMenuItems] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
const [categoryFilter, setCategoryFilter] = useState("All");
const [sortBy, setSortBy] = useState("default");
  const handleAddToCart = async (item) => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.id) {
      toast.warning("Please login before adding items to cart.");
      return;
    }

    const cartItem = {
      customerId: user.id,
      menuItemId: item.id,
      quantity: 1,
    };

    try {
      await addToCart(cartItem);

      toast.success(`${item.name} added to cart!`);
    } catch (error) {
      console.error("Add to cart error:", error);

      toast.error("Failed to add item to cart.");
    }
  };

  useEffect(() => {
    const loadMenuData = async () => {
      try {
        setLoading(true);

        const [menuResponse, recommendationResponse] =
          await Promise.all([
            api.get(`/menu/restaurant/${restaurantId}`),
            getRecommendations(restaurantId),
          ]);

        setMenuItems(
          Array.isArray(menuResponse.data)
            ? menuResponse.data
            : []
        );

        setRecommendations(
          Array.isArray(recommendationResponse.data)
            ? recommendationResponse.data
            : []
        );
      } catch (error) {
        console.error("Error fetching menu:", error);

        setMenuItems([]);
        setRecommendations([]);

        toast.error("Failed to load menu items.");
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      loadMenuData();
    }
  }, [restaurantId]);

  if (loading) {
    return (
      <main className="menu-page">
        <div className="menu-loading">
          <div className="menu-loading-icon">🍽️</div>
          <h2>Loading menu items...</h2>
        </div>
      </main>
    );
  }
const filteredMenu = menuItems
  .filter((item) => {
    const searchMatch =
      (item.name || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    const categoryMatch =
      categoryFilter === "All" ||
      item.category === categoryFilter;

    return searchMatch && categoryMatch;
  })
  .sort((a, b) => {
    if (sortBy === "low") {
      return Number(a.price) - Number(b.price);
    }

    if (sortBy === "high") {
      return Number(b.price) - Number(a.price);
    }

    return 0;
  });


  return (
    <main className="menu-page">
      <div className="menu-heading">
        <span>FoodExpress Menu</span>

        <h1>Restaurant Menu</h1>

        <p>
          Choose your favourite food and add it to your cart.
        </p>
      </div>

      {recommendations.length > 0 && (
        <section className="recommendation-section">
          <div className="recommendation-heading">
            <span>Smart Suggestions</span>

            <h2>🍽️ You May Also Like</h2>

            <p>
              Popular and affordable dishes from this restaurant.
            </p>
          </div>

          <div className="recommendation-grid">
            {recommendations.map((item) => (
              <article
                className="recommendation-card"
                key={item.id}
              >
              <img
  src={
    item.imageUrl ||
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"
  }
  alt={item.name}
  className="recommendation-image"
/>
                <div className="recommendation-icon">
                  🍴
                </div>

                <h3>{item.name}</h3>

                <p>
                  {item.description ||
                    "A delicious choice recommended for you."}
                </p>

                <div className="recommendation-bottom">
                  <strong>
                    ₹{Number(item.price || 0).toFixed(2)}
                  </strong>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="menu-filters">

  <input
    type="text"
    placeholder="🔍 Search food..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <select
    value={categoryFilter}
    onChange={(e) =>
      setCategoryFilter(e.target.value)
    }
  >
    <option value="All">All Categories</option>

    {[...new Set(menuItems.map(item => item.category))]
      .map(category => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
  </select>

  <select
    value={sortBy}
    onChange={(e) =>
      setSortBy(e.target.value)
    }
  >
    <option value="default">
      Sort By
    </option>

    <option value="low">
      Price Low → High
    </option>

    <option value="high">
      Price High → Low
    </option>
  </select>

</div>

      <section className="complete-menu-section">
        <h2>Complete Menu</h2>

        <div className="menu-container">
          {menuItems.length === 0 ? (
            <div className="no-menu-items">
              <div>🍽️</div>

              <h3>No menu items found</h3>

              <p>
                This restaurant has not added any food items yet.
              </p>
            </div>
          ) : (
filteredMenu.map((item) => (
                <article className="menu-card" key={item.id}>
                <img
  src={
    item.imageUrl ||
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"
  }
  alt={item.name}
  className="menu-food-image"
/>
                <div className="menu-card-top">
                  <div>
                    <h2>{item.name}</h2>

                    <span className="menu-category">
                      {item.category || "Food"}
                    </span>
                  </div>

                  <div
                    className={
                      item.available
                        ? "availability available"
                        : "availability unavailable"
                    }
                  >
                    {item.available
                      ? "Available"
                      : "Unavailable"}
                  </div>
                </div>

                <p className="menu-description">
                  {item.description ||
                    "Fresh and delicious food item."}
                </p>

                <div className="menu-card-bottom">
                  <strong className="menu-price">
                    ₹{Number(item.price || 0).toFixed(2)}
                  </strong>

                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
                    disabled={item.available === false}
                  >
                    {item.available === false
                      ? "Unavailable"
                      : "Add to Cart"}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default Menu;