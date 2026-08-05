import { useEffect, useState } from "react";
import api from "../services/api";
import "./ManageRestaurants.css";

function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    cuisine: "",
    rating: "",
    imageUrl: "",
  });

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoading(true);

      const response = await api.get("/restaurants");

      setRestaurants(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Error loading restaurants:", error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      cuisine: "",
      rating: "",
      imageUrl: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.address.trim() ||
      !formData.cuisine.trim() ||
      !formData.rating
    ) {
      alert("Please fill all restaurant details.");
      return;
    }

    const restaurantData = {
      name: formData.name.trim(),
      address: formData.address.trim(),
      cuisine: formData.cuisine.trim(),
      rating: Number(formData.rating),
      imageUrl: formData.imageUrl.trim(),
    };

    try {
      setSaving(true);

      if (editingId) {
        await api.put(
          `/restaurants/${editingId}`,
          restaurantData
        );

        alert("Restaurant updated successfully!");
      } else {
        await api.post("/restaurants", restaurantData);

        alert("Restaurant added successfully!");
      }

      resetForm();
      loadRestaurants();
    } catch (error) {
      console.error("Save restaurant error:", error);
      alert("Failed to save restaurant.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (restaurant) => {
    setEditingId(restaurant.id);

    setFormData({
      name: restaurant.name || "",
      address: restaurant.address || "",
      cuisine: restaurant.cuisine || "",
      rating: restaurant.rating || "",
      imageUrl: restaurant.imageUrl || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this restaurant?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/restaurants/${id}`);

      alert("Restaurant deleted successfully!");
      loadRestaurants();
    } catch (error) {
      console.error("Delete restaurant error:", error);
      alert("Failed to delete restaurant.");
    }
  };

  return (
    <main className="manage-restaurants-page">
      <div className="manage-restaurants-heading">
        <span>Admin Panel</span>

        <h1>Manage Restaurants</h1>

        <p>
          Add, edit and delete restaurants from FoodExpress.
        </p>
      </div>

      <section className="restaurant-form-card">
        <h2>
          {editingId
            ? "Edit Restaurant"
            : "Add New Restaurant"}
        </h2>

        <form
          className="restaurant-admin-form"
          onSubmit={handleSubmit}
        >
          <div className="restaurant-admin-form-grid">
            <div className="restaurant-admin-field">
              <label htmlFor="name">
                Restaurant Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter restaurant name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="restaurant-admin-field">
              <label htmlFor="cuisine">
                Cuisine
              </label>

              <input
                id="cuisine"
                type="text"
                name="cuisine"
                placeholder="Example: Italian"
                value={formData.cuisine}
                onChange={handleChange}
              />
            </div>

            <div className="restaurant-admin-field">
              <label htmlFor="address">
                Address
              </label>

              <input
                id="address"
                type="text"
                name="address"
                placeholder="Enter restaurant address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="restaurant-admin-field">
              <label htmlFor="rating">
                Rating
              </label>

              <input
                id="rating"
                type="number"
                name="rating"
                min="0"
                max="5"
                step="0.1"
                placeholder="Example: 4.5"
                value={formData.rating}
                onChange={handleChange}
              />
            </div>

            <div className="restaurant-admin-field">
              <label htmlFor="imageUrl">
                Restaurant Image URL
              </label>

              <input
                id="imageUrl"
                type="url"
                name="imageUrl"
                placeholder="Paste restaurant image URL"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          {formData.imageUrl && (
            <div
              style={{
                marginTop: "20px",
              }}
            >
              <p
                style={{
                  marginBottom: "10px",
                  fontWeight: "bold",
                }}
              >
                Image Preview
              </p>

              <img
                src={formData.imageUrl}
                alt="Restaurant preview"
                style={{
                  width: "240px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          <div className="restaurant-admin-actions">
            <button
              type="submit"
              className="save-restaurant-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Restaurant"
                  : "Add Restaurant"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-edit-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="restaurant-list-section">
        <div className="restaurant-list-heading">
          <h2>All Restaurants</h2>

          <button
            type="button"
            onClick={loadRestaurants}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="restaurant-admin-message">
            Loading restaurants...
          </p>
        ) : restaurants.length === 0 ? (
          <p className="restaurant-admin-message">
            No restaurants available.
          </p>
        ) : (
          <div className="restaurant-admin-table-wrapper">
            <table className="restaurant-admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Cuisine</th>
                  <th>Address</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {restaurants.map((restaurant) => (
                  <tr key={restaurant.id}>
                    <td>
                      {restaurant.imageUrl ? (
                        <img
                          src={restaurant.imageUrl}
                          alt={restaurant.name}
                          style={{
                            width: "75px",
                            height: "55px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      ) : (
                        "No image"
                      )}
                    </td>

                    <td>{restaurant.name}</td>
                    <td>{restaurant.cuisine}</td>
                    <td>{restaurant.address}</td>
                    <td>⭐ {restaurant.rating}</td>

                    <td>
                      <div className="restaurant-row-actions">
                        <button
                          type="button"
                          className="edit-restaurant-button"
                          onClick={() =>
                            handleEdit(restaurant)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-restaurant-button"
                          onClick={() =>
                            handleDelete(restaurant.id)
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default ManageRestaurants;