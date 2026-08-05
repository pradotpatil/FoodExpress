import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-section">
          <h2>🍔 FoodExpress</h2>

          <p>
            Delicious food delivered quickly and
            safely to your doorstep.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>

          <a href="/">Home</a>
          <a href="/restaurants">Restaurants</a>
          <a href="/cart">Cart</a>
          <a href="/orders">Orders</a>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>

          <p>📍 Pune, Maharashtra</p>
          <p>📧 support@foodexpress.com</p>
          <p>📞 +91 9876543210</p>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>

          <a href="https://github.com/pradotpatil">GitHub</a>
          <a href="#">LinkedIn</a>
          <a href="#">Instagram</a>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 FoodExpress. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;