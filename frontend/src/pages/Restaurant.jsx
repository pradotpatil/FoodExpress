import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import "./Restaurant.css";
import { toast } from "react-toastify";

import {
  addFavorite,
  getCustomerFavorites,
  removeFavorite,
} from "../services/favoriteService";

import pizzaHutImage from "../assets/restaurants/pizza_hut.jpg";
import pizzaHut1 from "../assets/restaurants/pizza_hut1.jpg";
import pizzaHut2 from "../assets/restaurants/pizza_hut2.jpg";

import dominosImage from "../assets/restaurants/dominos.jpg";
import dominos1 from "../assets/restaurants/dominos1.jpg";
import dominos2 from "../assets/restaurants/dominos2.jpg";

import burgerKingImage from "../assets/restaurants/burger_king.jpg";
import burgerKing1 from "../assets/restaurants/burger_king1.jpg";
import burgerKing2 from "../assets/restaurants/burger_king2.jpg";

import kfcImage from "../assets/restaurants/kfc.jpg";
import kfc1 from "../assets/restaurants/kfc1.jpg";
import kfc2 from "../assets/restaurants/kfc2.jpg";

import biryaniHouseImage from "../assets/restaurants/biryani_house.jpg";
import biryaniHouse1 from "../assets/restaurants/biryani_house1.jpg";
import biryaniHouse2 from "../assets/restaurants/biryani_house2.jpg";

import cafeCoffeeDayImage from "../assets/restaurants/cafe_coffee_day.jpg";
import cafeCoffeeDay1 from "../assets/restaurants/cafe_coffee_day1.jpg";
import cafeCoffeeDay2 from "../assets/restaurants/cafe_coffee_day2.jpg";

function Restaurant() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const customerId = user?.id;

  const [favoriteIds, setFavoriteIds] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentImages, setCurrentImages] = useState({});
  const [previewRestaurant, setPreviewRestaurant] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(0);
 const restaurantImages = {
  "Pizza Hut": [
    pizzaHutImage,
    pizzaHut1,
    pizzaHut2,
  ],

  "Domino's": [
    dominosImage,
    dominos1,
    dominos2,
  ],

  "Burger King": [
    burgerKingImage,
    burgerKing1,
    burgerKing2,
  ],

  KFC: [
    kfcImage,
    kfc1,
    kfc2,
  ],

  "Biryani House": [
    biryaniHouseImage,
    biryaniHouse1,
    biryaniHouse2,
  ],

  "Cafe Coffee Day": [
    cafeCoffeeDayImage,
    cafeCoffeeDay1,
    cafeCoffeeDay2,
  ],
};

  

const restaurantDetails = {
  "Pizza Hut": {
    offer: "50% OFF",
    deliveryTime: "25-30 min",
    deliveryFee: "Free Delivery",
    reviews: "2.5k",
    distance: "1.2 km",
    coupon: "SAVE50",
    trending: true,
  },

  "Domino's": {
    offer: "40% OFF",
    deliveryTime: "20-25 min",
    deliveryFee: "₹30 Delivery",
    reviews: "3.2k",
    distance: "2.4 km",
    coupon: "DOM40",
    trending: true,
        review: "Hot pizza delivered on time."

  },

  "Burger King": {
    offer: "30% OFF",
    deliveryTime: "25-35 min",
    deliveryFee: "Free Delivery",
    reviews: "1.8k",
    distance: "1.8 km",
    coupon: "KING30",
    trending: false,
     review: "Fresh burgers with quick delivery."

  },

  KFC: {
    offer: "20% OFF",
    deliveryTime: "30-40 min",
    deliveryFee: "₹40 Delivery",
    reviews: "4.1k",
    distance: "3.1 km",
    coupon: "KFC20",
    trending: true,
    review: "Crispy chicken and tasty fries."

  },

  "Biryani House": {
    offer: "25% OFF",
    deliveryTime: "35-45 min",
    deliveryFee: "Free Delivery",
    reviews: "2.2k",
    distance: "2.0 km",
    coupon: "BIRYANI25",
    trending: false,
    review: "Super Duper."
    
  },

  "Cafe Coffee Day": {
    offer: "Buy 1 Get 1",
    deliveryTime: "20-30 min",
    deliveryFee: "₹25 Delivery",
    reviews: "1.5k",
    distance: "900 m",
    coupon: "CCD100",
    trending: true,
    review: "Yummy"
  },
};

const foodCategories = [
  { name: "Pizza", icon: "🍕" },
  { name: "Burger", icon: "🍔" },
  { name: "Chicken", icon: "🍗" },
  { name: "Biryani", icon: "🍛" },
  { name: "Coffee", icon: "☕" },
  { name: "Dessert", icon: "🍰" },
];

const specialOffers = [
  {
    title: "Flat 50% OFF",
    description: "On your first order",
    color: "#ff4d4d",
    emoji: "🍕",
  },
  {
    title: "Free Delivery",
    description: "Above ₹299",
    color: "#00b894",
    emoji: "🚚",
  },
  {
    title: "Buy 1 Get 1",
    description: "Selected restaurants",
    color: "#6c5ce7",
    emoji: "🍔",
  },
  {
    title: "Weekend Special",
    description: "Extra 30% OFF",
    color: "#fdcb6e",
    emoji: "🎉",
  },
];

const restaurantReviews = {
  "Pizza Hut": [
    {
      user: "Rahul",
      rating: 5,
      comment: "Amazing pizza and very fast delivery.",
    },
    {
      user: "Priya",
      rating: 4,
      comment: "Loved the cheese burst pizza.",
    },
  ],

  "Domino's": [
    {
      user: "Amit",
      rating: 5,
      comment: "Hot and fresh pizza delivered on time.",
    },
    {
      user: "Sneha",
      rating: 4,
      comment: "Garlic bread was very tasty.",
    },
  ],

  "Burger King": [
    {
      user: "Rohan",
      rating: 5,
      comment: "Fresh burgers and crispy fries.",
    },
    {
      user: "Neha",
      rating: 4,
      comment: "Quick delivery and good taste.",
    },
  ],

  KFC: [
    {
      user: "Karan",
      rating: 5,
      comment: "Chicken was perfectly crispy.",
    },
    {
      user: "Pooja",
      rating: 4,
      comment: "Loved the Zinger Burger.",
    },
  ],

  "Biryani House": [
    {
      user: "Anjali",
      rating: 5,
      comment: "Authentic biryani taste and good quantity.",
    },
    {
      user: "Vikas",
      rating: 4,
      comment: "Very flavorful and fresh.",
    },
  ],

  "Cafe Coffee Day": [
    {
      user: "Riya",
      rating: 5,
      comment: "Coffee was excellent.",
    },
    {
      user: "Arjun",
      rating: 4,
      comment: "Nice desserts and quick service.",
    },
  ],
};
  

  useEffect(() => {
    fetchRestaurants();
  }, []);

  useEffect(() => {
  if (!customerId) {
    return;
  }

  getCustomerFavorites(customerId)
    .then((response) => {
      const restaurantIds = response.data.map(
        (favorite) => favorite.restaurantId
      );

      setFavoriteIds(restaurantIds);
    })
    .catch((error) => {
      console.error("Error loading favorites:", error);
    });
}, [customerId]);
  useEffect(() => {
    if (filteredRestaurants.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImages((prev) => {
        const updated = { ...prev };

        filteredRestaurants.forEach((restaurant) => {
          const images = getRestaurantImages(restaurant.name);
          updated[restaurant.id] =
            ((updated[restaurant.id] || 0) + 1) % images.length;
        });

        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [filteredRestaurants]);

  const handleFavorite = async (restaurantId) => {
    if (!customerId) {
      toast.warning("Please login first.");
      return;
    }

    const isAlreadyFavorite = favoriteIds.includes(restaurantId);

    try {
      if (isAlreadyFavorite) {
        await removeFavorite(customerId, restaurantId);
        setFavoriteIds((currentIds) =>
          currentIds.filter((id) => id !== restaurantId)
        );
        toast.info("Removed from favorites.");
      } else {
        await addFavorite({ customerId, restaurantId });
        setFavoriteIds((currentIds) => [
          ...currentIds,
          restaurantId,
        ]);
        toast.success("Added to favorites.");
      }
    } catch (error) {
      console.error("Favorite update failed:", error);
      toast.error("Unable to update favorites.");
    }
  };

  const fetchRestaurants = async () => {
    try {
     const response = await api.get("/restaurants");

      const restaurantData = Array.isArray(response.data)
        ? response.data
        : [];

      setRestaurants(restaurantData);
      setFilteredRestaurants(restaurantData);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setRestaurants([]);
      setFilteredRestaurants([]);
    } finally {
      setLoading(false);
    }
  };
  

  const handleSearch = (value) => {
    setSearch(value);

    const searchValue = value.trim().toLowerCase();

    const filtered = restaurants.filter((restaurant) => {
      const name = restaurant.name?.toLowerCase() || "";
      const cuisine = restaurant.cuisine?.toLowerCase() || "";
      const address = restaurant.address?.toLowerCase() || "";

      return (
        name.includes(searchValue) ||
        cuisine.includes(searchValue) ||
        address.includes(searchValue)
      );
    });

    setFilteredRestaurants(filtered);
  };

 const getRestaurantImages = (restaurantName) => {
  return (
    restaurantImages[restaurantName] || [
      pizzaHutImage,
      pizzaHutImage,
      pizzaHutImage,
    ]
  );
};

const nextImage = (restaurantId, restaurantName) => {
  const images = getRestaurantImages(restaurantName);

  setCurrentImages((prev) => ({
    ...prev,
    [restaurantId]: ((prev[restaurantId] || 0) + 1) % images.length,
  }));
};

const previousImage = (restaurantId, restaurantName) => {
  const images = getRestaurantImages(restaurantName);

  setCurrentImages((prev) => ({
    ...prev,
    [restaurantId]:
      ((prev[restaurantId] || 0) - 1 + images.length) % images.length,
  }));
};



  const getRestaurantDetails = (restaurantName) => {
    return (
      restaurantDetails[restaurantName] || {
        offer: "10% OFF",
        deliveryTime: "30-40 min",
        deliveryFee: "₹40 Delivery",
        reviews: "500+",
      }
    );
  };

  const getFeaturedRestaurant = () => {
  if (restaurants.length === 0) {
    return null;
  }

  return [...restaurants].sort(
    (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
  )[0];
};

  const sortByRating = () => {
    const sorted = [...filteredRestaurants].sort(
      (a, b) =>
        Number(b.rating || 0) - Number(a.rating || 0)
    );

    setFilteredRestaurants(sorted);
  };

  const sortByDelivery = () => {
    const sorted = [...filteredRestaurants].sort((a, b) => {
      const timeA = Number.parseInt(
        getRestaurantDetails(a.name).deliveryTime,
        10
      );

      const timeB = Number.parseInt(
        getRestaurantDetails(b.name).deliveryTime,
        10
      );

      return timeA - timeB;
    });

    setFilteredRestaurants(sorted);
  };

  const showFavourites = () => {
    setSearch("");

    const favouriteRestaurants = restaurants.filter(
      (restaurant) =>
        favoriteIds.includes(restaurant.id)
    );

    setFilteredRestaurants(favouriteRestaurants);
  };

  const resetRestaurants = () => {
    setSearch("");
    setFilteredRestaurants([...restaurants]);
  };

  if (loading) {
  return (
    <main className="restaurant-page">
      <h1 className="restaurant-title">
        Popular Restaurants
      </h1>

      <p className="restaurant-subtitle">
        Discover delicious food from your favourite restaurants
      </p>

      <div className="restaurant-grid">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div className="skeleton-card" key={item}>
            <div className="skeleton-image"></div>

            <div className="skeleton-content">
              <div className="skeleton-line skeleton-title-line"></div>

              <div className="skeleton-line skeleton-small-line"></div>

              <div className="skeleton-line skeleton-medium-line"></div>

              <div className="skeleton-line skeleton-medium-line"></div>

              <div className="skeleton-button"></div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

const featuredRestaurant = getFeaturedRestaurant();
const averageRating =
  restaurants.length > 0
    ? (
        restaurants.reduce(
          (total, restaurant) =>
            total + Number(restaurant.rating || 0),
          0
        ) / restaurants.length
      ).toFixed(1)
    : "0.0";

const freeDeliveryCount = restaurants.filter(
  (restaurant) =>
    getRestaurantDetails(restaurant.name).deliveryFee ===
    "Free Delivery"
).length;

  return (
    <main className="restaurant-page">
      <div className="hero-banner">

    <div className="hero-left">

        <span className="hero-tag">
            🍔 FoodExpress Special
        </span>

        <h1>
            Delicious Food <br />
            Delivered To Your Door
        </h1>

        <p>
            Order from your favourite restaurants with
            exciting discounts and lightning-fast delivery.
        </p>

        <button
            onClick={() =>
                document
                    .querySelector(".restaurant-grid")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    })
            }
        >
            Explore Restaurants
        </button>

    </div>

    <div className="hero-right">

        <img
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900"
            alt="Food"
        />

    </div>


</div>

<div className="offers-section">

    <h2>🔥 Today's Best Offers</h2>

    <div className="offers-container">

        {specialOffers.map((offer, index) => (

            <div
                key={index}
                className="offer-card"
                style={{ background: offer.color }}
            >

                <div className="offer-icon">
                    {offer.emoji}
                </div>

                <h3>{offer.title}</h3>

                <p>{offer.description}</p>

            </div>

        ))}

    </div>

</div>
<section className="stats-section">

    <div className="stat-card">

        <div className="stat-icon">🍽</div>

        <h2>{restaurants.length}</h2>

        <p>Restaurants</p>

    </div>

    <div className="stat-card">

        <div className="stat-icon">⭐</div>

        <h2>{averageRating}</h2>

        <p>Average Rating</p>

    </div>

    <div className="stat-card">

        <div className="stat-icon">❤️</div>

        <h2>{favoriteIds.length}</h2>

        <p>Favourites</p>

    </div>

    <div className="stat-card">

        <div className="stat-icon">🚚</div>

        <h2>{freeDeliveryCount}</h2>

        <p>Free Delivery</p>

    </div>

</section>

<h1 className="restaurant-title">
    Popular Restaurants
</h1>

      <p className="restaurant-subtitle">
        Discover delicious food from your favourite restaurants
      </p>
            <div className="category-section">

    <h2>Browse By Category</h2>

    <div className="category-grid">

        {foodCategories.map((category) => (

            <div
                key={category.name}
                className="category-card"
                onClick={() => handleSearch(category.name)}
            >

                <div className="category-icon">
                    {category.icon}
                </div>

                <p>{category.name}</p>

            </div>

        ))}

    </div>

</div> 
{featuredRestaurant && (
  <section className="featured-section">
    <h2>Featured Restaurant of the Day</h2>

    <div className="featured-card">
      <div className="featured-image-box">
        <img
src={
            featuredRestaurant.imageUrl ||
            getRestaurantImages(featuredRestaurant.name)[0]
          }
          alt={featuredRestaurant.name}
          className="featured-image"
        />

        <span className="featured-badge">
          ⭐ Best Choice
        </span>
      </div>

      <div className="featured-content">
        <span className="featured-label">
          FoodExpress Recommended
        </span>

        <h3>{featuredRestaurant.name}</h3>

        <p className="featured-cuisine">
          {featuredRestaurant.cuisine}
        </p>

        <p className="featured-address">
          📍 {featuredRestaurant.address}
        </p>

        <div className="featured-details">
          <span>
            ⭐ {featuredRestaurant.rating || "N/A"}
          </span>

          <span>
            ⏱{" "}
            {
              getRestaurantDetails(featuredRestaurant.name)
                .deliveryTime
            }
          </span>

          <span>
            🚚{" "}
            {
              getRestaurantDetails(featuredRestaurant.name)
                .deliveryFee
            }
          </span>
        </div>

        <div className="featured-coupon">
          Use code{" "}
          <strong>
            {
              getRestaurantDetails(featuredRestaurant.name)
                .coupon
            }
          </strong>
        </div>

        <button
          type="button"
          className="featured-button"
          onClick={() =>
  navigate(`/restaurant/${featuredRestaurant.id}`)
}
        >
          Explore Menu
        </button>
      </div>
    </div>
  </section>
)} 
      <div className="restaurant-search">
        <input
          type="text"
          placeholder="Search restaurants..."
          value={search}
          onChange={(event) =>
            handleSearch(event.target.value)
          }
        />
      </div>

      <div className="restaurant-filters">
        <button type="button" onClick={sortByRating}>
          ⭐ Top Rated
        </button>

        <button type="button" onClick={sortByDelivery}>
          ⏱ Fast Delivery
        </button>

        <button type="button" onClick={showFavourites}>
          ❤️ My Favourites
        </button>

        <button type="button" onClick={resetRestaurants}>
          Reset
        </button>
      </div>

      <div className="restaurant-count">
        {filteredRestaurants.length}{" "}
        {filteredRestaurants.length === 1
          ? "Restaurant"
          : "Restaurants"}{" "}
        Found
      </div>

      {filteredRestaurants.length === 0 ? (
        <p className="no-restaurants">
          No restaurants found.
        </p>
      ) : (
        <div className="restaurant-grid">
          {filteredRestaurants.map((restaurant) => {
            const details = getRestaurantDetails(
              restaurant.name
            );

            const isFavourite = favoriteIds.includes(
              restaurant.id
            );

            return (
              <div
                className="restaurant-card"
                key={restaurant.id}
              >
<div
  className="restaurant-image-container"
  onClick={() => {
    setPreviewRestaurant(restaurant);
    setPreviewIndex(currentImages[restaurant.id] || 0);
  }}
>          
 <img
  className="restaurant-image"
  src={
    restaurant.imageUrl ||
    getRestaurantImages(restaurant.name)[
      currentImages[restaurant.id] || 0
    ]
  }
  alt={restaurant.name}
  onClick={() => {
    setPreviewRestaurant(restaurant);
    setPreviewIndex(currentImages[restaurant.id] || 0);
  }}
/>

                <button
  type="button"
  className="slider-arrow slider-arrow-left"
  onClick={() =>
    previousImage(restaurant.id, restaurant.name)
  }
>
  ❮
</button>

<button
  type="button"
  className="slider-arrow slider-arrow-right"
  onClick={() =>
    nextImage(restaurant.id, restaurant.name)
  }
>
  ❯
</button>
<div className="slider-dots">
  {getRestaurantImages(restaurant.name).map((image, index) => (
    <span
      key={index}
      className={
        (currentImages[restaurant.id] || 0) === index
          ? "slider-dot active-dot"
          : "slider-dot"
      }
      onClick={() =>
        setCurrentImages((prev) => ({
          ...prev,
          [restaurant.id]: index,
        }))
      }
    ></span>
  ))}
</div>

                  <div className="quick-view-overlay">
  <h3>Chef's Special</h3>

  <div className="quick-view-details">
    <span>
      ⭐ {restaurant.rating || "N/A"}
    </span>

    <span>
      ⏱ {details.deliveryTime}
    </span>

    <span>
      📍 {details.distance}
    </span>
  </div>

  <p>
    {details.trending
      ? "🔥 Popular choice today"
      : "🍽 Recommended for you"}
  </p>

  <p>
    🚚 {details.deliveryFee}
  </p>

  <div className="quick-view-coupon">
    🎟 {details.coupon}
  </div>

  <button
    type="button"
    onClick={() =>
navigate(`/restaurant/${restaurant.id}`)    }
  >
    Quick View Menu
  </button>
</div>

                  <div className="restaurant-offer">
                    {details.offer}
                  </div>

                  <button
                    type="button"
                    aria-label={
                      isFavourite
                        ? "Remove from favourites"
                        : "Add to favourites"
                    }
                    className={
                      isFavourite
                        ? "favourite-button active"
                        : "favourite-button"
                    }
                    onClick={(event) => {
                      event.stopPropagation();
                      handleFavorite(restaurant.id);
                    }}
                  >
                    {isFavourite ? "♥" : "♡"}
                  </button>

                 <div className="restaurant-status">
  Open
</div>

{Number(restaurant.rating) >= 4.3 && (
  <div className="top-rated">
    ⭐ Top Rated
  </div>
)}
                </div>

                <div className="restaurant-content">
                  <div className="restaurant-heading">
                    <h2>{restaurant.name}</h2>

                    <div className="restaurant-rating">
                      ⭐ {restaurant.rating || "N/A"}
                    </div>
                  </div>

                  <p className="restaurant-reviews">
                    {details.reviews} ratings
                  </p>

                  <p className="restaurant-cuisine">
                    {restaurant.cuisine}
                  </p>

                 <p className="restaurant-address">
    📍 {restaurant.address}
</p>

<p className="restaurant-distance">
    📍 {details.distance} away
</p>
<p className="restaurant-review">
    "{details.review}"
</p>
<div className="coupon-card">
    🎟 Use Code <b>{details.coupon}</b>
</div>

                  <div className="restaurant-info">
                    <span>
                      ⏱ {details.deliveryTime}
                    </span>

                    <span>
                      🚚 {details.deliveryFee}
                    </span>
                  </div>

                  <button
  type="button"
  className="view-menu-button"
  onClick={() =>
    navigate(`/restaurant/${restaurant.id}`)
  }
>
  View Menu
</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {previewRestaurant && (
  <div
    className="image-preview-overlay"
    onClick={() => setPreviewRestaurant(null)}
  >
    <div
      className="image-preview-box"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="preview-close"
        onClick={() => setPreviewRestaurant(null)}
      >
        ✕
      </button>

      <button
        className="preview-arrow preview-left"
        onClick={() =>
          setPreviewIndex((prev) =>
            (prev - 1 + getRestaurantImages(previewRestaurant.name).length) %
            getRestaurantImages(previewRestaurant.name).length
          )
        }
      >
        ❮
      </button>

      <img
        src={
          previewRestaurant.imageUrl ||
          getRestaurantImages(previewRestaurant.name)[previewIndex]
        }
        alt={previewRestaurant.name}
        className="preview-image"
      />

      <button
        className="preview-arrow preview-right"
        onClick={() =>
          setPreviewIndex((prev) =>
            (prev + 1) %
            getRestaurantImages(previewRestaurant.name).length
          )
        }
      >
        ❯
      </button>

      <h2>{previewRestaurant.name}</h2>
    </div>
  </div>
)}
    </main>
  );
}

export default Restaurant;