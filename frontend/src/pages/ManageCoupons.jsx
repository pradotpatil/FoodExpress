import { useEffect, useState } from "react";
import api from "../services/api";
import "./ManageCoupons.css";

function ManageCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    minimumOrderAmount: "",
    expiryDate: "",
    active: true,
  });

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);

      const response = await api.get("/coupons");

      setCoupons(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Error loading coupons:", error);
      alert("Failed to load coupons.");
      setCoupons([]);
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
      code: "",
      discountType: "PERCENTAGE",
      discountValue: "",
      minimumOrderAmount: "",
      expiryDate: "",
      active: true,
    });

    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.code.trim() ||
      !formData.discountValue ||
      !formData.minimumOrderAmount ||
      !formData.expiryDate
    ) {
      alert("Please fill all coupon details.");
      return;
    }

    const couponData = {
      code: formData.code.trim().toUpperCase(),
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      minimumOrderAmount: Number(
        formData.minimumOrderAmount
      ),
      expiryDate: formData.expiryDate,
      active: formData.active,
    };

    try {
      setSaving(true);

      if (editingId) {
        await api.put(`/coupons/${editingId}`, couponData);

        alert("Coupon updated successfully!");
      } else {
        await api.post("/coupons", couponData);

        alert("Coupon created successfully!");
      }

      resetForm();
      loadCoupons();
    } catch (error) {
      console.error("Save coupon error:", error);

      const message =
        error.response?.data || "Failed to save coupon.";

      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditingId(coupon.id);

    setFormData({
      code: coupon.code || "",
      discountType:
        coupon.discountType || "PERCENTAGE",
      discountValue: coupon.discountValue || "",
      minimumOrderAmount:
        coupon.minimumOrderAmount || "",
      expiryDate: coupon.expiryDate || "",
      active: coupon.active ?? true,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (couponId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this coupon?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/coupons/${couponId}`);

      setCoupons((currentCoupons) =>
        currentCoupons.filter(
          (coupon) => coupon.id !== couponId
        )
      );

      alert("Coupon deleted successfully!");
    } catch (error) {
      console.error("Delete coupon error:", error);
      alert("Failed to delete coupon.");
    }
  };

  return (
    <main className="manage-coupons-page">
      <div className="manage-coupons-heading">
        <span>Admin Panel</span>

        <h1>Manage Coupons</h1>

        <p>
          Create and manage discount coupons.
        </p>
      </div>

      <section className="coupon-card">
        <h2>
          {editingId ? "Edit Coupon" : "Create Coupon"}
        </h2>

        <form
          className="coupon-form"
          onSubmit={handleSubmit}
        >
          <div className="coupon-form-grid">
            <div className="coupon-field">
              <label htmlFor="code">Coupon Code</label>

              <input
                id="code"
                type="text"
                name="code"
                placeholder="Example: SAVE20"
                value={formData.code}
                onChange={handleChange}
              />
            </div>

            <div className="coupon-field">
              <label htmlFor="discountType">
                Discount Type
              </label>

              <select
                id="discountType"
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
              >
                <option value="PERCENTAGE">
                  Percentage
                </option>

                <option value="FLAT">
                  Flat Amount
                </option>
              </select>
            </div>

            <div className="coupon-field">
              <label htmlFor="discountValue">
                Discount Value
              </label>

              <input
                id="discountValue"
                type="number"
                name="discountValue"
                min="0"
                step="0.01"
                placeholder={
                  formData.discountType === "PERCENTAGE"
                    ? "Example: 20"
                    : "Example: 100"
                }
                value={formData.discountValue}
                onChange={handleChange}
              />
            </div>

            <div className="coupon-field">
              <label htmlFor="minimumOrderAmount">
                Minimum Order Amount
              </label>

              <input
                id="minimumOrderAmount"
                type="number"
                name="minimumOrderAmount"
                min="0"
                step="0.01"
                placeholder="Example: 500"
                value={formData.minimumOrderAmount}
                onChange={handleChange}
              />
            </div>

            <div className="coupon-field">
              <label htmlFor="expiryDate">
                Expiry Date
              </label>

              <input
                id="expiryDate"
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <label className="coupon-active-field">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
            />

            Coupon is active
          </label>

          <div className="coupon-actions">
            <button
              type="submit"
              className="save-coupon-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Coupon"
                  : "Create Coupon"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-coupon-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="coupon-card coupon-list-section">
        <div className="coupon-list-heading">
          <h2>All Coupons</h2>

          <button
            type="button"
            onClick={loadCoupons}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="coupon-message">
            Loading coupons...
          </p>
        ) : coupons.length === 0 ? (
          <p className="coupon-message">
            No coupons available.
          </p>
        ) : (
          <div className="coupon-table-wrapper">
            <table className="coupon-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Value</th>
                  <th>Minimum Order</th>
                  <th>Expiry</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td>
                      <strong>{coupon.code}</strong>
                    </td>

                    <td>{coupon.discountType}</td>

                    <td>
                      {coupon.discountType === "PERCENTAGE"
                        ? `${coupon.discountValue}%`
                        : `₹${coupon.discountValue}`}
                    </td>

                    <td>
                      ₹
                      {Number(
                        coupon.minimumOrderAmount
                      ).toFixed(2)}
                    </td>

                    <td>
                      {coupon.expiryDate || "No expiry"}
                    </td>

                    <td>
                      <span
                        className={
                          coupon.active
                            ? "coupon-status active"
                            : "coupon-status inactive"
                        }
                      >
                        {coupon.active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="coupon-row-actions">
                        <button
                          type="button"
                          className="edit-coupon-button"
                          onClick={() => handleEdit(coupon)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-coupon-button"
                          onClick={() =>
                            handleDelete(coupon.id)
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

export default ManageCoupons;