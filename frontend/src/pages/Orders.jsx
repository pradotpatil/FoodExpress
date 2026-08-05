import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerOrders } from "../services/orderService";
import "./Orders.css";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const customerId = user?.id;

  const loadOrders = async () => {
    if (!customerId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      const response = await getCustomerOrders(customerId);

      setOrders(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error("Error loading orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();

    const interval = setInterval(() => {
      loadOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, [customerId]);

  const getStatusClass = (status) => {
    if (status === "Placed") {
      return "status-badge status-placed";
    }

    if (status === "Preparing") {
      return "status-badge status-preparing";
    }

    if (status === "Out for Delivery") {
      return "status-badge status-delivery";
    }

    if (status === "Delivered") {
      return "status-badge status-delivered";
    }

    return "status-badge";
  };

  const getStatusStep = (status) => {
    const steps = {
      Placed: 1,
      Preparing: 2,
      "Out for Delivery": 3,
      Delivered: 4,
    };

    return steps[status] || 1;
  };

  if (loading) {
    return (
      <main className="orders-page">
        <div className="orders-loading">
          Loading your orders...
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <div className="orders-heading">
        <span>Order History</span>

        <h1>My Orders</h1>

        <p>
          View your previous orders and track current deliveries.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders-card">
          <div className="no-orders-icon">📦</div>

          <h2>No Orders Yet</h2>

          <p>Your placed orders will appear here.</p>

          <button
            type="button"
            onClick={() => navigate("/restaurants")}
          >
            Browse Restaurants
          </button>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order, index) => {
            const currentStep = getStatusStep(order.status);

            return (
              <article
                className="order-card"
                key={order.id}
              >
                <div className="order-card-header">
                  <div>
                    <p>Order Number</p>
                    <h2>Order #{orders.length - index}</h2>
                  </div>

                  <span
                    className={getStatusClass(order.status)}
                  >
                    {order.status || "Placed"}
                  </span>
                </div>

                <div className="order-main-info">
                  <h3>{order.foodName}</h3>

                  <p>
                    Ordered on:{" "}
                    <strong>
                      {order.orderDate || "Not Available"}
                    </strong>
                  </p>
                </div>

                <div className="order-tracking-timeline">
                  <div
                    className={
                      currentStep >= 1
                        ? "tracking-step active"
                        : "tracking-step"
                    }
                  >
                    <span>✓</span>
                    <p>Placed</p>
                  </div>

                  <div
                    className={
                      currentStep >= 2
                        ? "tracking-line active"
                        : "tracking-line"
                    }
                  />

                  <div
                    className={
                      currentStep >= 2
                        ? "tracking-step active"
                        : "tracking-step"
                    }
                  >
                    <span>🍳</span>
                    <p>Preparing</p>
                  </div>

                  <div
                    className={
                      currentStep >= 3
                        ? "tracking-line active"
                        : "tracking-line"
                    }
                  />

                  <div
                    className={
                      currentStep >= 3
                        ? "tracking-step active"
                        : "tracking-step"
                    }
                  >
                    <span>🚚</span>
                    <p>Out for Delivery</p>
                  </div>

                  <div
                    className={
                      currentStep >= 4
                        ? "tracking-line active"
                        : "tracking-line"
                    }
                  />

                  <div
                    className={
                      currentStep >= 4
                        ? "tracking-step active"
                        : "tracking-step"
                    }
                  >
                    <span>🏠</span>
                    <p>Delivered</p>
                  </div>
                </div>

                <div className="order-information-grid">
                  <div>
                    <span>Payment</span>
                    <strong>
                      {order.paymentMethod || "Not Available"}
                    </strong>
                  </div>

                  <div>
                    <span>Phone</span>
                    <strong>
                      {order.phone || "Not Available"}
                    </strong>
                  </div>

                  <div className="order-address">
                    <span>Delivery Address</span>
                    <strong>
                      {order.address || "Not Available"}
                    </strong>
                  </div>

                  {order.paymentId && (
                    <div className="order-address">
                      <span>Payment ID</span>
                      <strong>{order.paymentId}</strong>
                    </div>
                  )}
                </div>

                <div className="order-price-section">
                  <div>
                    <span>Price</span>
                    <strong>
                      ₹{Number(order.price || 0).toFixed(2)}
                    </strong>
                  </div>

                  <div>
                    <span>Quantity</span>
                    <strong>{order.quantity}</strong>
                  </div>

                  <div>
                    <span>Final Amount</span>
                    <strong className="order-total">
                      ₹
                      {Number(
                        order.finalAmount || order.total || 0
                      ).toFixed(2)}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="track-order-button"
                  onClick={() =>
                    navigate(`/track-order/${order.id}`)
                  }
                >
                  🚚 Track Order
                </button>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default Orders;