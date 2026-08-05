import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { onMessage } from "firebase/messaging";
import { toast } from "react-toastify";

import { messaging } from "./firebase";
import {
  requestNotificationPermission,
} from "./firebaseMessaging";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import Restaurant from "./pages/Restaurant";
import RestaurantDetails from "./pages/RestaurantDetails";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderSuccess from "./pages/OrderSuccess";
import TrackOrder from "./pages/TrackOrder";

import AdminDashboard from "./pages/AdminDashboard";
import ManageRestaurants from "./pages/ManageRestaurants";
import ManageMenu from "./pages/ManageMenu";
import ManageUsers from "./pages/ManageUsers";
import ManageOrders from "./pages/ManageOrders";
import ManageCoupons from "./pages/ManageCoupons";
import Analytics from "./pages/Analytics";

import AddMenuData from "./pages/AddMenuData";
import SeedData from "./pages/SeedData";

function App() {
  useEffect(() => {
    const enableNotifications = async () => {
      const token =
        await requestNotificationPermission();

      if (token) {
        localStorage.setItem("fcmToken", token);

        console.log(
          "Notification token saved successfully."
        );
      }
    };

    enableNotifications();

    const unsubscribe = onMessage(
      messaging,
      (payload) => {
        console.log(
          "Foreground notification received:",
          payload
        );

        const title =
          payload.notification?.title ||
          "FoodExpress Notification";

        const body =
          payload.notification?.body ||
          "You have received a new update.";

        toast.info(`${title}: ${body}`, {
          autoClose: 5000,
        });

        if (
          Notification.permission === "granted"
        ) {
          new Notification(title, {
            body,
            icon: "/foodexpress-icon.png",
          });
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* Customer Protected Routes */}
        <Route
          path="/restaurants"
          element={
            <ProtectedRoute>
              <Restaurant />
            </ProtectedRoute>
          }
        />

        <Route
          path="/restaurant/:id"
          element={
            <ProtectedRoute>
              <RestaurantDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/menu/:restaurantId"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-success"
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/track-order/:id"
          element={
            <ProtectedRoute>
              <TrackOrder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/restaurants"
          element={
            <AdminRoute>
              <ManageRestaurants />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/menu"
          element={
            <AdminRoute>
              <ManageMenu />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <ManageOrders />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/coupons"
          element={
            <AdminRoute>
              <ManageCoupons />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <AdminRoute>
              <Analytics />
            </AdminRoute>
          }
        />

        {/* Development Routes */}
        <Route
          path="/add-menu-data"
          element={<AddMenuData />}
        />

        <Route
          path="/seed-data"
          element={<SeedData />}
        />

        {/* Keep this route last */}
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;