import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { placeOrder } from "../services/orderService";
import { deleteCartItem } from "../services/cartService";
import "./Checkout.css";
import api from "../services/api";
import {
  createPaymentOrder,
  verifyPayment,
} from "../services/paymentService";
function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
const user = JSON.parse(localStorage.getItem("user"));
  const {
    cartItems = [],
    subtotal = 0,
    deliveryFee = 0,
    gst = 0,
    grandTotal = 0,
  } = location.state || {};

  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "Cash on Delivery",
  });

  const [placingOrder, setPlacingOrder] = useState(false);
const [couponCode, setCouponCode] = useState("");
const [discountAmount, setDiscountAmount] = useState(0);
const [couponMessage, setCouponMessage] = useState("");
const [applyingCoupon, setApplyingCoupon] = useState(false);
  const handleChange = (event) => {
    const { name, value } = event.target;

    setCustomerDetails((previousDetails) => ({
      ...previousDetails,
      [name]: value,
    }));
  };

  const handleApplyCoupon = async () => {
  if (!couponCode.trim()) {
    setCouponMessage("Please enter a coupon code.");
    return;
  }

  try {
    setApplyingCoupon(true);
    setCouponMessage("");

    const response = await api.get("/coupons/validate", {
      params: {
        code: couponCode.trim(),
        orderAmount: grandTotal,
      },
    });

    setDiscountAmount(
      Number(response.data.discountAmount || 0)
    );

    setCouponMessage(
      `Coupon ${response.data.code} applied successfully!`
    );
  } catch (error) {
    console.error("Coupon validation error:", error);

    setDiscountAmount(0);

    setCouponMessage(
      error.response?.data || "Invalid coupon code."
    );
  } finally {
    setApplyingCoupon(false);
  }
};

const placeFoodOrders = async (paymentId = "") => {
  const orderDate = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const finalAmount = Math.max(
    Number(grandTotal) - Number(discountAmount),
    0
  );

  for (const item of cartItems) {
    const itemTotal =
      Number(item.price) * Number(item.quantity);

    const itemDiscount =
      Number(grandTotal) > 0
        ? (itemTotal / Number(grandTotal)) *
          Number(discountAmount)
        : 0;

    const itemFinalAmount = Math.max(
      itemTotal - itemDiscount,
      0
    );

    const order = {
      customerId: item.customerId,
      customerName: customerDetails.name,
        customerEmail: user?.email || "",

      phone: customerDetails.phone,
      address: customerDetails.address,
      paymentMethod: customerDetails.paymentMethod,
      paymentId,

      orderDate,

      foodName: item.foodName,
      price: Number(item.price),
      quantity: Number(item.quantity),
      total: Number(itemTotal.toFixed(2)),

      couponCode:
        discountAmount > 0 ? couponCode.trim() : "",

      discountAmount: Number(
        itemDiscount.toFixed(2)
      ),

      finalAmount: Number(
        itemFinalAmount.toFixed(2)
      ),

      status: "Placed",
    };

    await placeOrder(order);
await api.delete(`/cart/${item.id}`);  }

  navigate("/order-success", {
    state: {
      customerName: customerDetails.name,
      address: customerDetails.address,
      paymentMethod: customerDetails.paymentMethod,
      paymentId,
      grandTotal: Number(grandTotal),
      couponCode:
        discountAmount > 0 ? couponCode.trim() : "",
      discountAmount: Number(discountAmount),
      finalAmount,
    },
  });
};

const handleOnlinePayment = async () => {
  const finalAmount = Math.max(
    Number(grandTotal) - Number(discountAmount),
    0
  );

  try {
    const orderResponse = await api.post("/orders", orderData);
    const {
      orderId,
      amount,
      currency,
      keyId,
    } = orderResponse.data;

    const options = {
      key: keyId,
      amount,
      currency,
      name: "FoodExpress",
      description: "Food Order Payment",
      order_id: orderId,

      handler: async (response) => {
        try {
          await verifyPayment({
  razorpayOrderId: response.razorpay_order_id,
  razorpayPaymentId: response.razorpay_payment_id,
  razorpaySignature: response.razorpay_signature,
});

          await placeFoodOrders(
            response.razorpay_payment_id
          );
        } catch (error) {
          console.error(
            "Payment verification failed:",
            error
          );

          alert("Payment verification failed.");
        }
      },

      prefill: {
        name: customerDetails.name,
        contact: customerDetails.phone,
      },

      theme: {
        color: "#ff4d4d",
      },

      modal: {
        ondismiss: () => {
          alert("Payment cancelled.");
        },
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.open();
  } catch (error) {
    console.error(
      "Razorpay order creation failed:",
      error
    );

    alert("Unable to start online payment.");
  }
};

  const handleSubmit = async (event) => {
  event.preventDefault();

  if (
    !customerDetails.name.trim() ||
    !customerDetails.phone.trim() ||
    !customerDetails.address.trim()
  ) {
    alert("Please fill all customer details.");
    return;
  }

  if (!/^[0-9]{10}$/.test(customerDetails.phone)) {
    alert("Please enter a valid 10-digit phone number.");
    return;
  }

  try {
    setPlacingOrder(true);

    if (
      customerDetails.paymentMethod === "UPI" ||
      customerDetails.paymentMethod === "Card"
    ) {
      await handleOnlinePayment();
    } else {
      await placeFoodOrders();
    }
  } catch (error) {
    console.error("Checkout Error:", error);
    alert("Failed to place order.");
  } finally {
    setPlacingOrder(false);
  }
};

  if (cartItems.length === 0) {
    return (
      <div className="empty-checkout">
        <div className="empty-checkout-card">
          <div className="empty-checkout-icon">🛒</div>

          <h2>No items available for checkout</h2>

          <p>Please add food items to your cart before continuing.</p>

          <button
            type="button"
            onClick={() => navigate("/cart")}
          >
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-heading">
        <span>Secure Checkout</span>
        <h1>Complete Your Order</h1>
        <p>
          Enter your delivery information and review your order.
        </p>
      </div>

      <form
        className="checkout-container"
        onSubmit={handleSubmit}
      >
        <section className="checkout-left">
          <div className="checkout-card">
            <div className="checkout-section-heading">
              <div className="checkout-section-icon">👤</div>

              <div>
                <h2>Customer Details</h2>
                <p>Enter your contact and delivery information.</p>
              </div>
            </div>

            <div className="checkout-form-group">
              <label htmlFor="name">Full Name</label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={customerDetails.name}
                onChange={handleChange}
              />
            </div>

            <div className="checkout-form-group">
              <label htmlFor="phone">Phone Number</label>

              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Enter 10-digit phone number"
                value={customerDetails.phone}
                onChange={handleChange}
                maxLength="10"
              />
            </div>

            <div className="checkout-form-group">
              <label htmlFor="address">Delivery Address</label>

              <textarea
                id="address"
                name="address"
                placeholder="House number, street, area and city"
                value={customerDetails.address}
                onChange={handleChange}
                rows="5"
              />
            </div>
          </div>

          <div className="checkout-card">
            <div className="checkout-section-heading">
              <div className="checkout-section-icon">💳</div>

              <div>
                <h2>Payment Method</h2>
                <p>Select your preferred payment option.</p>
              </div>
            </div>

            <div className="payment-options">
              <label
                className={
                  customerDetails.paymentMethod ===
                  "Cash on Delivery"
                    ? "payment-option selected"
                    : "payment-option"
                }
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={
                    customerDetails.paymentMethod ===
                    "Cash on Delivery"
                  }
                  onChange={handleChange}
                />

                <span className="payment-icon">💵</span>

                <span className="payment-text">
                  <strong>Cash on Delivery</strong>
                  <small>Pay when your order arrives</small>
                </span>
              </label>

              <label
                className={
                  customerDetails.paymentMethod === "UPI"
                    ? "payment-option selected"
                    : "payment-option"
                }
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="UPI"
                  checked={
                    customerDetails.paymentMethod === "UPI"
                  }
                  onChange={handleChange}
                />

                <span className="payment-icon">📱</span>

                <span className="payment-text">
                  <strong>UPI Payment</strong>
                  <small>Pay using any UPI application</small>
                </span>
              </label>

              <label
                className={
                  customerDetails.paymentMethod === "Card"
                    ? "payment-option selected"
                    : "payment-option"
                }
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Card"
                  checked={
                    customerDetails.paymentMethod === "Card"
                  }
                  onChange={handleChange}
                />

                <span className="payment-icon">💳</span>

                <span className="payment-text">
                  <strong>Debit or Credit Card</strong>
                  <small>Pay securely using your card</small>
                </span>
              </label>
            </div>
          </div>
        </section>

        <aside className="checkout-right">
          <div className="order-summary-card">
            <div className="order-summary-heading">
              <h2>Order Summary</h2>
              <span>{cartItems.length} items</span>
            </div>

            <div className="checkout-items">
              {cartItems.map((item) => (
                <div
                  className="checkout-item"
                  key={item.id}
                >
                  <div>
                    <h3>{item.foodName}</h3>
                    <p>
                      ₹{Number(item.price).toFixed(2)} ×{" "}
                      {item.quantity}
                    </p>
                  </div>

                  <strong>
                    ₹
                    {(
                      Number(item.price) * item.quantity
                    ).toFixed(2)}
                  </strong>
                </div>
              ))}
            </div>

            <div className="order-price-details">
              <div className="order-price-row">
                <span>Subtotal</span>
                <span>₹{Number(subtotal).toFixed(2)}</span>
              </div>

              <div className="order-price-row">
                <span>Delivery Fee</span>
                <span>
                  ₹{Number(deliveryFee).toFixed(2)}
                </span>
              </div>

              <div className="order-price-row">
                <span>GST (5%)</span>
                <span>₹{Number(gst).toFixed(2)}</span>
              </div>
            </div>
            <div
  style={{
    marginTop: "20px",
    marginBottom: "20px",
  }}
>
  <h3>Apply Coupon</h3>

  <div
    style={{
      display: "flex",
      gap: "10px",
    }}
  >
    <input
      type="text"
      placeholder="Enter coupon code"
      value={couponCode}
      onChange={(event) =>
        setCouponCode(event.target.value.toUpperCase())
      }
      style={{
        flex: 1,
        padding: "12px",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    />

    <button
      type="button"
      onClick={handleApplyCoupon}
      disabled={applyingCoupon}
      style={{
        padding: "12px 18px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#ff4d4d",
        color: "#ffffff",
        cursor: "pointer",
      }}
    >
      {applyingCoupon ? "Applying..." : "Apply"}
    </button>
  </div>

  {couponMessage && (
    <p
      style={{
        marginTop: "10px",
        color:
          discountAmount > 0 ? "green" : "red",
        fontWeight: "bold",
      }}
    >
      {couponMessage}
    </p>
  )}
</div>

    <div className="coupon-section">
  <h3>Apply Coupon</h3>

  <div className="coupon-input-row">
    <input
      type="text"
      placeholder="Enter coupon code"
      value={couponCode}
      onChange={(event) =>
        setCouponCode(event.target.value.toUpperCase())
      }
    />

    <button
      type="button"
      onClick={handleApplyCoupon}
      disabled={applyingCoupon}
    >
      {applyingCoupon ? "Applying..." : "Apply"}
    </button>
  </div>

  {couponMessage && (
    <p
      className={
        discountAmount > 0
          ? "coupon-success-message"
          : "coupon-error-message"
      }
    >
      {couponMessage}
    </p>
  )}
</div>

<div className="order-grand-total">
  <span>Grand Total</span>

  <strong>
    ₹{Number(grandTotal).toFixed(2)}
  </strong>
</div>

{discountAmount > 0 && (
  <div className="order-discount-total">
    <span>Coupon Discount</span>

    <strong>
      -₹{Number(discountAmount).toFixed(2)}
    </strong>
  </div>
)}

<div className="order-final-total">
  <span>Final Amount</span>

  <strong>
    ₹
    {Math.max(
      Number(grandTotal) - Number(discountAmount),
      0
    ).toFixed(2)}
  </strong>
</div>

<button
  type="submit"
  className="confirm-order-button"
  disabled={placingOrder}
>
  {placingOrder
    ? "Placing Order..."
    : `Confirm Order • ₹${Math.max(
        Number(grandTotal) - Number(discountAmount),
        0
      ).toFixed(2)}`}
</button>        

            <p className="secure-payment-text">
              🔒 Your payment and personal information are secure.
            </p>
          </div>
        </aside>
      </form>
    </main>
  );
}

export default Checkout;