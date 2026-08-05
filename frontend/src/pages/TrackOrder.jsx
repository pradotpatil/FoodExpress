import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import L from "leaflet";

import api from "../services/api";
import "leaflet/dist/leaflet.css";
import "./TrackOrder.css";

const restaurantLocation = [18.5204, 73.8567];
const customerLocation = [18.5314, 73.8446];

const restaurantIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -38],
});

const customerIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -38],
});

const riderIcon = new L.Icon({
  iconUrl:
    "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
  iconSize: [44, 44],
  iconAnchor: [22, 44],
  popupAnchor: [0, -40],
});

function TrackOrder() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error("Track order error:", error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();

    const interval = setInterval(() => {
      loadOrder();
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  const progress = useMemo(() => {
    if (!order) {
      return 0;
    }

    if (order.status === "Placed") {
      return 0.1;
    }

    if (order.status === "Preparing") {
      return 0.3;
    }

    if (order.status === "Out for Delivery") {
      return 0.7;
    }

    if (order.status === "Delivered") {
      return 1;
    }

    return 0.1;
  }, [order]);

  const riderLocation = useMemo(() => {
    const latitude =
      restaurantLocation[0] +
      (customerLocation[0] - restaurantLocation[0]) *
        progress;

    const longitude =
      restaurantLocation[1] +
      (customerLocation[1] - restaurantLocation[1]) *
        progress;

    return [latitude, longitude];
  }, [progress]);

  const estimatedTime = useMemo(() => {
    if (!order) {
      return "Calculating...";
    }

    if (order.status === "Placed") {
      return "35–40 minutes";
    }

    if (order.status === "Preparing") {
      return "25–30 minutes";
    }

    if (order.status === "Out for Delivery") {
      return "10–15 minutes";
    }

    if (order.status === "Delivered") {
      return "Delivered";
    }

    return "30 minutes";
  }, [order]);

  if (loading) {
    return (
      <main className="track-order-page">
        <div className="track-order-message">
          Loading live tracking...
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="track-order-page">
        <div className="track-order-message">
          Order not found.
        </div>
      </main>
    );
  }

  return (
    <main className="track-order-page">
      <div className="track-order-heading">
        <span>Live Delivery</span>

        <h1>Track Your Order</h1>

        <p>
          Follow your FoodExpress delivery in real time.
        </p>
      </div>

      <section className="tracking-summary-card">
        <div>
          <span>Food</span>
          <strong>{order.foodName}</strong>
        </div>

        <div>
          <span>Status</span>
          <strong>{order.status || "Placed"}</strong>
        </div>

        <div>
          <span>Estimated Time</span>
          <strong>{estimatedTime}</strong>
        </div>

        <div>
          <span>Delivery Address</span>
          <strong>
            {order.address || "Customer location"}
          </strong>
        </div>
      </section>

      <section className="tracking-map-card">
        <MapContainer
          center={riderLocation}
          zoom={14}
          scrollWheelZoom
          className="tracking-map"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker
            position={restaurantLocation}
            icon={restaurantIcon}
          >
            <Popup>Restaurant location</Popup>
          </Marker>

          <Marker
            position={customerLocation}
            icon={customerIcon}
          >
            <Popup>Delivery location</Popup>
          </Marker>

          <Marker
            position={riderLocation}
            icon={riderIcon}
          >
            <Popup>
              Delivery rider: {order.status}
            </Popup>
          </Marker>

          <Polyline
            positions={[
              restaurantLocation,
              riderLocation,
              customerLocation,
            ]}
            pathOptions={{
              color: "#ff4d4d",
              weight: 5,
            }}
          />
        </MapContainer>
      </section>

      <section className="tracking-progress-card">
        <div
          className={
            progress >= 0.1
              ? "tracking-progress-step active"
              : "tracking-progress-step"
          }
        >
          <span>✓</span>
          <p>Placed</p>
        </div>

        <div
          className={
            progress >= 0.3
              ? "tracking-progress-line active"
              : "tracking-progress-line"
          }
        />

        <div
          className={
            progress >= 0.3
              ? "tracking-progress-step active"
              : "tracking-progress-step"
          }
        >
          <span>🍳</span>
          <p>Preparing</p>
        </div>

        <div
          className={
            progress >= 0.7
              ? "tracking-progress-line active"
              : "tracking-progress-line"
          }
        />

        <div
          className={
            progress >= 0.7
              ? "tracking-progress-step active"
              : "tracking-progress-step"
          }
        >
          <span>🛵</span>
          <p>Out for Delivery</p>
        </div>

        <div
          className={
            progress >= 1
              ? "tracking-progress-line active"
              : "tracking-progress-line"
          }
        />

        <div
          className={
            progress >= 1
              ? "tracking-progress-step active"
              : "tracking-progress-step"
          }
        >
          <span>🏠</span>
          <p>Delivered</p>
        </div>
      </section>
    </main>
  );
}

export default TrackOrder;