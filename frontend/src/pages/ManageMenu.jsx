import { useEffect, useState } from "react";
import api from "../services/api";
import "./ManageMenu.css";

function ManageMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
  restaurantId: "",
  name: "",
  description: "",
  price: "",
  category: "",
  imageUrl: "",
  available: true,
});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [menuResponse, restaurantResponse] =
        await Promise.all([
          api.get("/menu"),
          api.get("/restaurants"),
        ]);

      setMenuItems(
        Array.isArray(menuResponse.data)
          ? menuResponse.data
          : []
      );

      setRestaurants(
        Array.isArray(restaurantResponse.data)
          ? restaurantResponse.data
          : []
      );
    } catch (error) {
      console.error("Error loading menu data:", error);
      setMenuItems([]);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

const resetForm = () => {
  setFormData({
    restaurantId: "",
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
    available: true,
  });

  setEditingId(null);
};

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.restaurantId ||
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.price ||
      !formData.category.trim()
    ) {
      alert("Please fill all menu item details.");
      return;
    }

const menuData = {
  restaurantId: formData.restaurantId,
  name: formData.name.trim(),
  description: formData.description.trim(),
  price: Number(formData.price),
  category: formData.category.trim(),
  imageUrl: formData.imageUrl.trim(),
  available: formData.available,
};

    try {
      setSaving(true);

      if (editingId) {
        await api.put(`/menu/${editingId}`, menuData);
        alert("Menu item updated successfully!");
      } else {
        await api.post("/menu", menuData);
        alert("Menu item added successfully!");
      }

      resetForm();
      loadData();
    } catch (error) {
      console.error("Save menu item error:", error);
      alert("Failed to save menu item.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);

    setFormData({
      restaurantId: item.restaurantId || "",
      name: item.name || "",
      description: item.description || "",
      price: item.price || "",
      category: item.category || "",
      available: item.available ?? true,
      imageUrl: item.imageUrl || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/menu/${id}`);
      alert("Menu item deleted successfully!");
      loadData();
    } catch (error) {
      console.error("Delete menu item error:", error);
      alert("Failed to delete menu item.");
    }
  };

  const getRestaurantName = (restaurantId) => {
    const restaurant = restaurants.find(
      (item) => item.id === restaurantId
    );

    return restaurant?.name || "Unknown Restaurant";
  };

  return (
    <main className="manage-menu-page">
      <div className="manage-menu-heading">
        <span>Admin Panel</span>

        <h1>Manage Menu</h1>

        <p>
          Add, edit and remove food items from restaurant menus.
        </p>
      </div>

      <section className="menu-form-card">
        <h2>
          {editingId ? "Edit Menu Item" : "Add Menu Item"}
        </h2>

        <form
          className="menu-admin-form"
          onSubmit={handleSubmit}
        >
          <div className="menu-admin-form-grid">
            <div className="menu-admin-field">
              <label htmlFor="restaurantId">
                Restaurant
              </label>

              <select
                id="restaurantId"
                name="restaurantId"
                value={formData.restaurantId}
                onChange={handleChange}
              >
                <option value="">
                  Select Restaurant
                </option>

                {restaurants.map((restaurant) => (
                  <option
                    key={restaurant.id}
                    value={restaurant.id}
                  >
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="menu-admin-field">
              <label htmlFor="name">Food Name</label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Example: Margherita Pizza"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="menu-admin-field">
              <label htmlFor="category">Category</label>

              <input
                id="category"
                type="text"
                name="category"
                placeholder="Example: Pizza"
                value={formData.category}
                onChange={handleChange}
              />
            </div>

            <div className="menu-admin-field">
              <label htmlFor="price">Price</label>

              <input
                id="price"
                type="number"
                name="price"
                min="0"
                step="0.01"
                placeholder="Example: 299"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
<div className="menu-admin-field">
  <label htmlFor="imageUrl">
    Food Image URL
  </label>

  <input
    id="imageUrl"
    type="text"
    name="imageUrl"
    placeholder="https://..."
    value={formData.imageUrl}
    onChange={handleChange}
  />
</div>

{formData.imageUrl && (
  <img
    src={formData.imageUrl}
    alt="Preview"
    style={{
      width: "180px",
      height: "120px",
      objectFit: "cover",
      borderRadius: "12px",
      marginTop: "10px",
    }}
  />
)}
            <div className="menu-admin-field menu-description-field">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows="4"
                placeholder="Enter food description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          <label className="menu-availability-field">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
            />

            Available for ordering
          </label>

          <div className="menu-admin-actions">
            <button
              type="submit"
              className="save-menu-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Menu Item"
                  : "Add Menu Item"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-menu-edit-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="menu-list-section">
        <div className="menu-list-heading">
          <h2>All Menu Items</h2>

          <button
            type="button"
            onClick={loadData}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="menu-admin-message">
            Loading menu items...
          </p>
        ) : menuItems.length === 0 ? (
          <p className="menu-admin-message">
            No menu items available.
          </p>
        ) : (
          <div className="menu-admin-table-wrapper">
            <table className="menu-admin-table">
              <thead>
                <tr>
                  <th>Food</th>
                  <th>Restaurant</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {menuItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name}</strong>
                      <p>{item.description}</p>
                    </td>

                    <td>
                      {getRestaurantName(item.restaurantId)}
                    </td>

                    <td>{item.category}</td>

                    <td>
                      ₹{Number(item.price).toFixed(2)}
                    </td>

                    <td>
                      <span
                        className={
                          item.available
                            ? "menu-status available"
                            : "menu-status unavailable"
                        }
                      >
                        {item.available
                          ? "Available"
                          : "Unavailable"}
                      </span>
                    </td>

                    <td>
                      <div className="menu-row-actions">
                        <button
                          type="button"
                          className="edit-menu-button"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-menu-button"
                          onClick={() =>
                            handleDelete(item.id)
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

export default ManageMenu;