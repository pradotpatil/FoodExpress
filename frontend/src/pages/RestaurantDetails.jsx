import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import {
  addReview,
  getRestaurantReviews,
} from "../services/reviewService";
import "./RestaurantDetails.css";
import { toast } from "react-toastify";
import pizzaHutImage from "../assets/restaurants/pizza_hut.jpg";
import dominosImage from "../assets/restaurants/dominos.jpg";
import burgerKingImage from "../assets/restaurants/burger_king.jpg";
import kfcImage from "../assets/restaurants/kfc.jpg";
import biryaniHouseImage from "../assets/restaurants/biryani_house.jpg";
import cafeCoffeeDayImage from "../assets/restaurants/cafe_coffee_day.jpg";
import pizzaHut1 from "../assets/restaurants/pizza_hut1.jpg";
import pizzaHut2 from "../assets/restaurants/pizza_hut2.jpg";

import dominos1 from "../assets/restaurants/dominos1.jpg";
import dominos2 from "../assets/restaurants/dominos2.jpg";

import burgerKing1 from "../assets/restaurants/burger_king1.jpg";
import burgerKing2 from "../assets/restaurants/burger_king2.jpg";

import kfc1 from "../assets/restaurants/kfc1.jpg";
import kfc2 from "../assets/restaurants/kfc2.jpg";

import biryaniHouse1 from "../assets/restaurants/biryani_house1.jpg";
import biryaniHouse2 from "../assets/restaurants/biryani_house2.jpg";

import cafeCoffeeDay1 from "../assets/restaurants/cafe_coffee_day1.jpg";
import cafeCoffeeDay2 from "../assets/restaurants/cafe_coffee_day2.jpg";
function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const [previewIndex, setPreviewIndex] = useState(null);
const [previewImages, setPreviewImages] = useState([]);
const [isFavourite, setIsFavourite] = useState(false);
const user = JSON.parse(localStorage.getItem("user"));

const [reviews, setReviews] = useState([]);

const [reviewData, setReviewData] = useState({
  rating: 5,
  comment: "",
});
  const restaurantImages = {
    "Pizza Hut": pizzaHutImage,
    "Domino's": dominosImage,
    "Burger King": burgerKingImage,
    KFC: kfcImage,
    "Biryani House": biryaniHouseImage,
    "Cafe Coffee Day": cafeCoffeeDayImage,
  };

  const restaurantGallery = {
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

  const getRestaurantImage = (restaurantName) => {
    return restaurantImages[restaurantName] || pizzaHutImage;
  };
const handleShare = async () => {
  const shareData = {
    title: restaurant.name,
    text: `Check out ${restaurant.name} on FoodExpress`,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(
        window.location.href
      );

      alert("Restaurant link copied!");
    }
  } catch (error) {
    console.error("Share error:", error);
  }
};


  const restaurantInfo = {
  "Pizza Hut": {
    phone: "+91 98765 43210",
    openingTime: "10:00 AM",
    closingTime: "11:00 PM",
  },

  "Domino's": {
    phone: "+91 98765 43211",
    openingTime: "10:30 AM",
    closingTime: "11:30 PM",
  },

  "Burger King": {
    phone: "+91 98765 43212",
    openingTime: "11:00 AM",
    closingTime: "11:00 PM",
  },

  KFC: {
    phone: "+91 98765 43213",
    openingTime: "11:00 AM",
    closingTime: "11:30 PM",
  },

  "Biryani House": {
    phone: "+91 98765 43214",
    openingTime: "12:00 PM",
    closingTime: "11:00 PM",
  },

  "Cafe Coffee Day": {
    phone: "+91 98765 43215",
    openingTime: "8:00 AM",
    closingTime: "10:00 PM",
  },
};


  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/restaurants/${id}`);

        if (!response.data) {
          setError("Restaurant not found.");
          return;
        }

        setRestaurant(response.data);
      }
       
      catch (error) {
        console.error("Error fetching restaurant:", error);
        setError("Failed to load restaurant details.");
      } finally {
        setLoading(false);
      }
      const reviewResponse =
  await getRestaurantReviews(id);

setReviews(reviewResponse.data);
    };

    fetchRestaurant();
  }, [id]);

  useEffect(() => {
  const savedFavourites =
    JSON.parse(localStorage.getItem("favourites")) || [];

  setIsFavourite(savedFavourites.includes(id));
}, [id]);

  if (loading) {
    return (
      <div className="restaurant-details-loading">
        Loading restaurant details...
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="restaurant-details-loading">
        <div>
          <p>{error || "Restaurant not found."}</p>

          <button
            type="button"
            onClick={() => navigate("/restaurants")}
          >
            Back to Restaurants
          </button>
        </div>
      </div>
    );
  }


  const info = restaurantInfo[restaurant.name] || {
  phone: "Not available",
  openingTime: "10:00 AM",
  closingTime: "10:00 PM",
};


const galleryImages =
  restaurantGallery[restaurant.name] || [
    getRestaurantImage(restaurant.name),
  ];

  const handleReviewSubmit = async (event) => {
  event.preventDefault();

  if (!user) {
    toast.warning("Please login to submit a review.");
    return;
  }

  if (!reviewData.comment.trim()) {
    toast.warning("Please write a review.");
    return;
  }

  try {
    const newReview = {
      customerId: user.id,
      customerName: user.name,
      restaurantId: id,
      rating: Number(reviewData.rating),
      comment: reviewData.comment.trim(),
      reviewDate: new Date().toLocaleDateString("en-IN"),
    };

    const response = await addReview(newReview);

    setReviews((currentReviews) => [
      response.data,
      ...currentReviews,
    ]);

    setReviewData({
      rating: 5,
      comment: "",
    });

    toast.success("Review submitted successfully!");
  } catch (error) {
    console.error("Review submission failed:", error);
    toast.error("Failed to submit review.");
  }
};


  return (
    <main className="restaurant-details-page">
      <div className="restaurant-banner">
       <img
  src={
    restaurant.imageUrl ||
    getRestaurantImage(restaurant.name)
  }
  alt={restaurant.name}
/>
      </div>

      <div className="restaurant-details-content">
  <div className="restaurant-title-row">
  <h1>{restaurant.name}</h1>

  <div className="restaurant-title-actions">
    <button
      type="button"
      className="details-share"
      onClick={handleShare}
    >
      📤
    </button>

    <button
      type="button"
      className={
        isFavourite
          ? "details-favourite active"
          : "details-favourite"
      }
      onClick={() => {
        const saved =
          JSON.parse(
            localStorage.getItem("favourites")
          ) || [];

        if (isFavourite) {
          const updated = saved.filter(
            (restaurantId) => restaurantId !== id
          );

          localStorage.setItem(
            "favourites",
            JSON.stringify(updated)
          );

          setIsFavourite(false);
        } else {
          const updated = [...saved, id];

          localStorage.setItem(
            "favourites",
            JSON.stringify(updated)
          );

          setIsFavourite(true);
        }
      }}
    >
      {isFavourite ? "❤️" : "🤍"}
    </button>
  </div>
</div>
        <div className="restaurant-rating-row">
          ⭐ {restaurant.rating}

          <span>{restaurant.cuisine}</span>
        </div>

        <p>📍 {restaurant.address}</p>

        <div className="restaurant-extra">
          <span>🚚 Free Delivery</span>
          <span>⏱ 25-30 min</span>
          <span>🔥 50% OFF</span>
        </div>

        <section className="restaurant-contact-section">
  <h2>Restaurant Information</h2>

  <div className="restaurant-contact-grid">
    <div className="restaurant-contact-card">
      <span className="contact-icon">📞</span>

      <div>
        <h3>Contact Number</h3>
        <p>{info.phone}</p>
      </div>
    </div>

    <div className="restaurant-contact-card">
      <span className="contact-icon">🕒</span>

      <div>
        <h3>Opening Hours</h3>
        <p>
          {info.openingTime} - {info.closingTime}
        </p>
      </div>
    </div>

    <div className="restaurant-contact-card">
      <span className="contact-icon">🟢</span>

      <div>
        <h3>Status</h3>
        <p>Open for Orders</p>
      </div>
    </div>
  </div>
</section>

        <h2>About Restaurant</h2>

<p>
  Fresh ingredients, delicious food and quick delivery
  with premium quality.
</p>

<section className="gallery-section">

  <h2>Restaurant Gallery</h2>

  <div className="gallery-grid">

    {galleryImages.map((image, index) => (

     <img
  key={index}
  src={image}
  alt={`${restaurant.name} ${index + 1}`}
  className="gallery-image"
  onClick={() => {
    setPreviewImages(galleryImages);
    setPreviewIndex(index);
  }}
/>

    ))}

  </div>

</section>

<section className="reviews-section">
          <h2>Customer Reviews</h2>

          {reviews.length === 0 ? (
  <p>No reviews available for this restaurant.</p>
) : (
  <div className="reviews-grid">
    {reviews.map((review) => (
      <div className="review-card" key={review.id}>
        <div className="review-header">
          <div className="review-avatar">
            {(review.customerName || "U").charAt(0)}
          </div>

          <div>
            <h3>{review.customerName}</h3>

            <div className="review-stars">
              {"⭐".repeat(review.rating)}
            </div>

            <small>{review.reviewDate}</small>
          </div>
        </div>

        <p>{review.comment}</p>
      </div>
    ))}
  </div>
)}
        </section>

        {/* Review Form */}

<form
  className="review-form"
  onSubmit={handleReviewSubmit}
>
  <h2>Write a Review</h2>

  <div className="rating-input">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() =>
          setReviewData((previousData) => ({
            ...previousData,
            rating: star,
          }))
        }
      >
        {star <= reviewData.rating ? "⭐" : "☆"}
      </button>
    ))}
  </div>

  <textarea
    rows="4"
    placeholder="Share your experience..."
    value={reviewData.comment}
    onChange={(event) =>
      setReviewData((previousData) => ({
        ...previousData,
        comment: event.target.value,
      }))
    }
  />

  <button type="submit">
    Submit Review
  </button>
</form>

{/* Existing Reviews */}

<section className="reviews-section">
  <h2>Customer Reviews</h2>

  ...
</section>

        <button
          type="button"
          className="view-menu-big-button"
          onClick={() =>
            navigate(`/menu/${restaurant.id}`)
          }
        >
          View Full Menu
        </button>
      </div>

      {previewIndex !== null && (
  <div
    className="image-preview-overlay"
    onClick={() => setPreviewIndex(null)}
  >
    <div
      className="image-preview-box"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="preview-close"
        onClick={() => setPreviewIndex(null)}
      >
        ✕
      </button>

      <button
        className="preview-arrow preview-left"
        onClick={() =>
          setPreviewIndex(
            (previewIndex - 1 + previewImages.length) %
              previewImages.length
          )
        }
      >
        ❮
      </button>

      <img
        src={previewImages[previewIndex]}
        alt="Preview"
        className="preview-image"
      />

      <button
        className="preview-arrow preview-right"
        onClick={() =>
          setPreviewIndex(
            (previewIndex + 1) %
              previewImages.length
          )
        }
      >
        ❯
      </button>
    </div>
  </div>
)}

    </main>
  );
}

export default RestaurantDetails;