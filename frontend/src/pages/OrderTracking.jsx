import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../services/orderService";
import "./OrderTracking.css";

function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderSteps = [
    "Placed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
  ];

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await getOrderById(orderId);

      setOrder(response.data);
    } catch (error) {
      console.error("Error loading order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="tracking-loading">
        Loading order tracking...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="tracking-loading">
        <div>
          <h2>Order not found</h2>

          <button
            type="button"
            onClick={() => navigate("/orders")}
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const currentStepIndex = orderSteps.indexOf(order.status);

  return (
    <main className="tracking-page">
      <div className="tracking-heading">
        <span>Live Order Status</span>
        <h1>Track Your Order</h1>
        <p>
          Follow your order from confirmation to delivery.
        </p>
      </div>

      <div className="tracking-container">
        <section className="tracking-card">
          <div className="tracking-order-header">
            <div>
              <p>Order ID</p>
              <h2>#{order.id}</h2>
            </div>

            <span className="tracking-status">
              {order.status}
            </span>
          </div>

          <div className="tracking-food-info">
            <h3>{order.foodName}</h3>

            <p>
              Quantity: {order.quantity}
            </p>

            <p>
              Total: ₹{Number(order.total).toFixed(2)}
            </p>
          </div>

          <div className="tracking-timeline">
            {orderSteps.map((step, index) => {
              const completed = index <= currentStepIndex;

              return (
                <div
                  className={
                    completed
                      ? "tracking-step completed"
                      : "tracking-step"
                  }
                  key={step}
                >
                  <div className="tracking-circle">
                    {completed ? "✓" : index + 1}
                  </div>

                  <div className="tracking-step-content">
                    <h3>{step}</h3>

                    <p>
                      {step === "Placed" &&
                        "Your order has been confirmed."}

                      {step === "Preparing" &&
                        "The restaurant is preparing your food."}

                      {step === "Out for Delivery" &&
                        "Your delivery partner is on the way."}

                      {step === "Delivered" &&
                        "Your order has been delivered."}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="delivery-person-card">
            <div className="delivery-avatar">
              🚴
            </div>

            <div>
              <h3>Rahul Patil</h3>
              <p>Your delivery partner</p>
              <strong>📞 +91 98765 43210</strong>
            </div>
          </div>

          <button
            type="button"
            className="back-orders-button"
            onClick={() => navigate("/orders")}
          >
            Back to My Orders
          </button>
        </section>
      </div>
    </main>
  );
}

export default OrderTracking;