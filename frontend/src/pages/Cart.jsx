import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCart,
  updateCartItem,
  deleteCartItem,
} from "../services/cartService";

import "./Cart.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const customerId = user?.id;

  const loadCart = () => {
    if (!customerId) {
      setCartItems([]);
      return;
    }

    getCart(customerId)
      .then((response) => {
        setCartItems(
          Array.isArray(response.data) ? response.data : []
        );
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
        setCartItems([]);
      });
  };

  useEffect(() => {
    loadCart();
  }, [customerId]);

  const handleIncrease = (item) => {
    const updatedItem = {
      customerId: item.customerId,
      menuItemId: item.menuItemId,
      quantity: item.quantity + 1,
    };

    updateCartItem(item.id, updatedItem)
      .then(() => {
        loadCart();
      })
      .catch((error) => {
        console.error(
          "Error increasing quantity:",
          error
        );
      });
  };

  const handleDecrease = (item) => {
    if (item.quantity === 1) {
      deleteCartItem(item.id)
        .then(() => {
          loadCart();
        })
        .catch((error) => {
          console.error(
            "Error deleting cart item:",
            error
          );
        });

      return;
    }

    const updatedItem = {
      customerId: item.customerId,
      menuItemId: item.menuItemId,
      quantity: item.quantity - 1,
    };

    updateCartItem(item.id, updatedItem)
      .then(() => {
        loadCart();
      })
      .catch((error) => {
        console.error(
          "Error decreasing quantity:",
          error
        );
      });
  };

  const handleDelete = (id) => {
    deleteCartItem(id)
      .then(() => {
        loadCart();
      })
      .catch((error) => {
        console.error(
          "Error deleting cart item:",
          error
        );
      });
  };

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  const deliveryFee = subtotal > 0 ? 40 : 0;
  const gst = subtotal * 0.05;
  const grandTotal = subtotal + deliveryFee + gst;

  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
        cartItems,
        subtotal,
        deliveryFee,
        gst,
        grandTotal,
      },
    });
  };

  if (cartItems.length === 0) {
    return (
      <main className="empty-cart-page">
        <div className="empty-cart-card">
          <div className="empty-cart-icon">🛒</div>

          <h1>Your Cart Is Empty</h1>

          <p>
            You have not added any food items yet.
            Browse restaurants and add something delicious.
          </p>

          <button
            type="button"
            onClick={() => navigate("/restaurants")}
          >
            Browse Restaurants
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <h1>My Cart</h1>

      {cartItems.map((item) => (
        <div className="cart-item-card" key={item.id}>
          <h2>{item.foodName}</h2>

          <p>
            Price: ₹{Number(item.price).toFixed(2)}
          </p>

          <div className="cart-quantity-row">
            <button
              type="button"
              onClick={() => handleDecrease(item)}
            >
              −
            </button>

            <span>{item.quantity}</span>

            <button
              type="button"
              onClick={() => handleIncrease(item)}
            >
              +
            </button>
          </div>

          <p>
            <strong>
              Item Total: ₹
              {(
                Number(item.price) * item.quantity
              ).toFixed(2)}
            </strong>
          </p>

          <button
            type="button"
            className="remove-cart-button"
            onClick={() => handleDelete(item.id)}
          >
            Remove
          </button>
        </div>
      ))}

      <section className="cart-bill-card">
        <h2>Bill Details</h2>

        <div className="cart-bill-row">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="cart-bill-row">
          <span>Delivery Fee</span>
          <span>₹{deliveryFee.toFixed(2)}</span>
        </div>

        <div className="cart-bill-row">
          <span>GST (5%)</span>
          <span>₹{gst.toFixed(2)}</span>
        </div>

        <hr />

        <div className="cart-grand-total">
          <span>Grand Total</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>

        <button
          type="button"
          className="checkout-button"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
      </section>
    </main>
  );
}

export default Cart;