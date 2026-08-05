import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "./OrderSuccess.css";

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const orderData = location.state || {};

  const {
    customerName = "",
    address = "",
    paymentMethod = "",
    paymentId = "",
    grandTotal = 0,
    couponCode = "",
    discountAmount = 0,
    finalAmount = grandTotal,
  } = orderData;

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();

    const invoiceNumber = `INV-${Date.now()}`;

    doc.setFontSize(22);
    doc.text("FoodExpress", 20, 20);

    doc.setFontSize(12);
    doc.text(`Invoice Number: ${invoiceNumber}`, 20, 35);

    doc.text(
      `Customer: ${customerName || "Not available"}`,
      20,
      48
    );

    doc.text(
      `Address: ${address || "Not available"}`,
      20,
      58
    );

    doc.text(
      `Payment Method: ${paymentMethod || "Not available"}`,
      20,
      68
    );

    let currentY = 78;

    if (paymentId) {
      doc.text(`Payment ID: ${paymentId}`, 20, currentY);
      currentY += 10;
    }

    doc.line(20, currentY, 190, currentY);
    currentY += 14;

    doc.text(
      `Grand Total: Rs. ${Number(grandTotal).toFixed(2)}`,
      20,
      currentY
    );

    currentY += 12;

    doc.text(
      `Discount: Rs. ${Number(discountAmount).toFixed(2)}`,
      20,
      currentY
    );

    currentY += 12;

    doc.text(
      `Final Amount: Rs. ${Number(finalAmount).toFixed(2)}`,
      20,
      currentY
    );

    if (couponCode) {
      currentY += 12;

      doc.text(
        `Coupon Used: ${couponCode}`,
        20,
        currentY
      );
    }

    currentY += 14;

    doc.line(20, currentY, 190, currentY);

    currentY += 14;

    doc.text(
      "Thank you for ordering from FoodExpress!",
      20,
      currentY
    );

    doc.save(`${invoiceNumber}.pdf`);
  };

  return (
    <main className="order-success-page">
      <div className="order-success-card">
        <div className="success-icon">✓</div>

        <h1>Order Confirmed!</h1>

        <p className="success-message">
          Thank you, {customerName}. Your food order has been
          placed successfully.
        </p>

        <div className="success-details">
          <div>
            <span>Payment Method</span>
            <strong>
              {paymentMethod || "Not available"}
            </strong>
          </div>

          {paymentId && (
            <div>
              <span>Payment ID</span>
              <strong>{paymentId}</strong>
            </div>
          )}

          <div>
            <span>Delivery Address</span>
            <strong>{address || "Not available"}</strong>
          </div>

          <div>
            <span>Grand Total</span>
            <strong>
              ₹{Number(grandTotal).toFixed(2)}
            </strong>
          </div>

          {Number(discountAmount) > 0 && (
            <div>
              <span>Discount</span>
              <strong>
                -₹{Number(discountAmount).toFixed(2)}
              </strong>
            </div>
          )}

          <div>
            <span>Final Amount</span>
            <strong>
              ₹{Number(finalAmount).toFixed(2)}
            </strong>
          </div>

          {couponCode && (
            <div>
              <span>Coupon</span>
              <strong>{couponCode}</strong>
            </div>
          )}

          <div>
            <span>Order Status</span>
            <strong className="success-status">
              Placed
            </strong>
          </div>
        </div>

        <div className="success-actions">

  <button
    type="button"
    className="download-invoice-button"
    onClick={handleDownloadInvoice}
  >
    📄 Download Invoice
  </button>

  <button
    type="button"
    className="view-orders-button"
    onClick={() => navigate("/orders")}
  >
    View My Orders
  </button>

  <button
    type="button"
    className="continue-shopping-button"
    onClick={() => navigate("/restaurants")}
  >
    Continue Shopping
  </button>

</div>
      </div>
    </main>
  );
}

export default OrderSuccess;