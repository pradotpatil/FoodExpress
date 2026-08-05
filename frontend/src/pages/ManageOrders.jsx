import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import {
  deleteOrder,
  getAllOrders,
} from "../services/orderService";
import "./ManageOrders.css";

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const response = await getAllOrders();

      setOrders(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error("Error loading orders:", error);
      setOrders([]);
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {
    try {
      setUpdatingId(orderId);

      await api.put(
        `/orders/${orderId}/status`,
        newStatus,
        {
          headers: {
            "Content-Type": "text/plain",
          },
        }
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );

      toast.success(
        `Order status changed to ${newStatus}.`
      );
    } catch (error) {
      console.error(
        "Order status update failed:",
        error
      );

      toast.error("Failed to update order status.");

      loadOrders();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteOrder(orderId);

      setOrders((currentOrders) =>
        currentOrders.filter(
          (order) => order.id !== orderId
        )
      );

      toast.success("Order deleted successfully!");
    } catch (error) {
      console.error(
        "Order deletion failed:",
        error
      );

      toast.error("Failed to delete order.");
    }
  };

  const getStatusClass = (status) => {
    if (status === "Placed") {
      return "admin-status placed";
    }

    if (status === "Preparing") {
      return "admin-status preparing";
    }

    if (status === "Out for Delivery") {
      return "admin-status out-for-delivery";
    }

    if (status === "Delivered") {
      return "admin-status delivered";
    }

    return "admin-status";
  };

  return (
    <main className="manage-orders-page">
      <div className="manage-orders-heading">
        <span>Admin Panel</span>

        <h1>Manage Orders</h1>

        <p>
          View customer orders and update delivery status.
        </p>
      </div>

      <section className="orders-admin-section">
        <div className="orders-admin-heading">
          <h2>All Orders</h2>

          <button
            type="button"
            onClick={loadOrders}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="orders-admin-message">
            Loading orders...
          </p>
        ) : orders.length === 0 ? (
          <p className="orders-admin-message">
            No orders available.
          </p>
        ) : (
          <div className="orders-admin-table-wrapper">
            <table className="orders-admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Food</th>
                  <th>Order Details</th>
                  <th>Payment</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>
                        {order.customerName ||
                          "Customer"}
                      </strong>

                      <p>
                        {order.phone ||
                          "Phone unavailable"}
                      </p>

                      <p>
                        {order.address ||
                          "Address unavailable"}
                      </p>
                    </td>

                    <td>
                      <strong>{order.foodName}</strong>

                      <p>
                        Quantity: {order.quantity}
                      </p>

                      <p>
                        ₹
                        {Number(
                          order.price || 0
                        ).toFixed(2)}{" "}
                        each
                      </p>
                    </td>

                    <td>
                      <p>
                        ID:{" "}
                        <span className="order-id-text">
                          {order.id}
                        </span>
                      </p>

                      <p>
                        {order.orderDate ||
                          "Date unavailable"}
                      </p>
                    </td>

                    <td>
                      <p>
                        {order.paymentMethod ||
                          "Not available"}
                      </p>

                      {order.paymentId && (
                        <p className="order-id-text">
                          {order.paymentId}
                        </p>
                      )}
                    </td>

                    <td>
                      <strong className="admin-order-total">
                        ₹
                        {Number(
                          order.finalAmount ||
                            order.total ||
                            0
                        ).toFixed(2)}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={getStatusClass(
                          order.status
                        )}
                      >
                        {order.status || "Placed"}
                      </span>

                      <select
                        value={order.status || "Placed"}
                        disabled={
                          updatingId === order.id
                        }
                        onChange={(event) =>
                          handleStatusChange(
                            order.id,
                            event.target.value
                          )
                        }
                      >
                        <option value="Placed">
                          Placed
                        </option>

                        <option value="Preparing">
                          Preparing
                        </option>

                        <option value="Out for Delivery">
                          Out for Delivery
                        </option>

                        <option value="Delivered">
                          Delivered
                        </option>
                      </select>

                      {updatingId === order.id && (
                        <p className="status-updating-text">
                          Updating...
                        </p>
                      )}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="delete-admin-order-button"
                        onClick={() =>
                          handleDelete(order.id)
                        }
                      >
                        Delete
                      </button>
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

export default ManageOrders;