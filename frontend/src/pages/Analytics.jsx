import { useEffect, useState } from "react";
import api from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "./Analytics.css";

function Analytics() {
  const [stats, setStats] = useState({
    users: 0,
    restaurants: 0,
    orders: 0,
    revenue: 0,
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [users, restaurants, orders] = await Promise.all([
        api.get("/users"),
        api.get("/restaurants"),
        api.get("/orders"),
      ]);

      const totalRevenue = orders.data.reduce(
        (sum, order) => sum + (order.total || 0),
        0
      );

      setStats({
        users: users.data.length,
        restaurants: restaurants.data.length,
        orders: orders.data.length,
        revenue: totalRevenue,
      });
    } catch (error) {
      console.error("Analytics Error:", error);
    }
  };

  const chartData = [
    {
      name: "Users",
      value: stats.users,
    },
    {
      name: "Restaurants",
      value: stats.restaurants,
    },
    {
      name: "Orders",
      value: stats.orders,
    },
    {
      name: "Revenue",
      value: stats.revenue,
    },
  ];

  const pieData = [
    {
      name: "Users",
      value: stats.users,
    },
    {
      name: "Restaurants",
      value: stats.restaurants,
    },
    {
      name: "Orders",
      value: stats.orders,
    },
  ];

  const pieColors = [
    "#ff4d4d",
    "#007bff",
    "#28a745",
  ];

  return (
    <main className="analytics-page">
      <div className="analytics-header">
        <span>Admin Panel</span>

        <h1>Analytics Dashboard</h1>

        <p>
          View orders, revenue and business insights.
        </p>
      </div>

      <div className="analytics-cards">
        <div className="analytics-card">
          <h2>Total Users</h2>
          <h1>{stats.users}</h1>
        </div>

        <div className="analytics-card">
          <h2>Total Restaurants</h2>
          <h1>{stats.restaurants}</h1>
        </div>

        <div className="analytics-card">
          <h2>Total Orders</h2>
          <h1>{stats.orders}</h1>
        </div>

        <div className="analytics-card">
          <h2>Total Revenue</h2>
          <h1>₹{stats.revenue}</h1>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="chart-card">
          <h2>Revenue Analytics</h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="value"
                fill="#ff4d4d"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Application Distribution</h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={
                      pieColors[
                        index % pieColors.length
                      ]
                    }
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}

export default Analytics;