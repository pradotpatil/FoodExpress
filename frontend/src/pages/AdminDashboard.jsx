import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [
        restaurantsResponse,
        ordersResponse,
        menuResponse,
      ] = await Promise.all([
        api.get("/restaurants"),
        api.get("/orders"),
        api.get("/menu"),
      ]);

      setRestaurants(
        Array.isArray(restaurantsResponse.data)
          ? restaurantsResponse.data
          : []
      );

      setOrders(
        Array.isArray(ordersResponse.data)
          ? ordersResponse.data
          : []
      );

      setMenuItems(
        Array.isArray(menuResponse.data)
          ? menuResponse.data
          : []
      );
    } catch (error) {
      console.error("Dashboard loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.total || 0),
    0
  );

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  if (loading) {
    return (
      <div className="admin-loading">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-heading">
        <span>FoodExpress Admin</span>

        <h1>Admin Dashboard</h1>

        <p>
          Manage restaurants, menu items, orders and application
          activity.
        </p>
      </div>

      <section className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">🍽️</div>

          <div>
            <p>Total Restaurants</p>
            <h2>{restaurants.length}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">🍔</div>

          <div>
            <p>Total Menu Items</p>
            <h2>{menuItems.length}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">📦</div>

          <div>
            <p>Total Orders</p>
            <h2>{orders.length}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">✅</div>

          <div>
            <p>Delivered Orders</p>
            <h2>{deliveredOrders}</h2>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">₹</div>

          <div>
            <p>Total Revenue</p>
            <h2>₹{totalRevenue.toFixed(2)}</h2>
          </div>
        </div>
      </section>

      <section className="admin-actions-section">
        <h2>Quick Actions</h2>

        <div className="admin-actions-grid">
          <button
            type="button"
            onClick={() => navigate("/admin/restaurants")}
          >
            🍽️ Manage Restaurants
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/menu")}
          >
            🍔 Manage Menu
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
          >
            📦 Manage Orders
          </button>
      <button
  type="button"
  onClick={() => navigate("/admin/coupons")}
>
  🎟️ Manage Coupons
</button>
          <button
            type="button"
            onClick={() => navigate("/seed-data")}
          >
            🌱 Add Seed Data
          </button>

          <button
  type="button"
  onClick={() => navigate("/admin/analytics")}
>
  📊 View Analytics
</button>
        </div>
      </section>

      <section className="admin-recent-orders">
        <div className="admin-section-heading">
          <h2>Recent Orders</h2>

          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
          >
            View All
          </button>
        </div>

        {orders.length === 0 ? (
          <p className="admin-empty-message">
            No orders available.
          </p>
        ) : (
          <div className="admin-orders-table-wrapper">
            <table className="admin-orders-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Food</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td>
                      {order.customerName || "Customer"}
                    </td>

                    <td>{order.foodName}</td>

                    <td>{order.quantity}</td>

                    <td>
                      ₹{Number(order.total).toFixed(2)}
                    </td>

                    <td>
                      <span
                        className={`admin-order-status ${String(
                          order.status
                        )
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                      >
                        {order.status}
                      </span>
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

export default AdminDashboard;