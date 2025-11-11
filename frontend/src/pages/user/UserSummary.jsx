import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../tables.css';
import api from '../../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UserSummary = () => {
  const { user_id } = useParams();
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await api.get(`/api/user_summary/${user_id}`);
        setSummary(response.data.summary || []);
      } catch (error) {
        console.error("Failed to fetch summary:", error);
        setSummary([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [user_id]);

  if (loading) return <div className="loading-spinner"></div>;

  // Chart Data Preparation
  const locations = summary.map(item => item.location);
  const amounts = summary.map(item => item.amount_spent);
  const daysSpent = summary.map(item => item.days_spent);
  const bookingDates = summary.map(item =>
    new Date(item.booked_time).toLocaleDateString()
  );

  // Amount Paid per Booking (Bar Chart)
  const barData = {
    labels: locations,
    datasets: [
      {
        label: 'Amount Paid (₹)',
        data: amounts,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Days Spent Distribution (Pie Chart)
  const pieData = {
    labels: locations,
    datasets: [
      {
        label: 'Days Spent',
        data: daysSpent,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
        hoverOffset: 8,
      },
    ],
  };

  // Amount Paid Over Time (Line Chart)
  const lineData = {
    labels: bookingDates,
    datasets: [
      {
        label: 'Amount Paid Over Time (₹)',
        data: amounts,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className="table-container">
      <h1>Your Past Bookings Summary</h1>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Amount Paid per Booking</h3>
          <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>

        <div className="chart-card">
          <h3>Days Spent Distribution</h3>
          <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>

        <div className="chart-card">
          <h3>Spending Trend Over Time</h3>
          <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      <div className="table-wrapper">
        {summary.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Location</th>
                <th>Address</th>
                <th>Booked</th>
                <th>Released</th>
                <th>Days Spent</th>
                <th>Amount Paid</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((item, index) => (
                <tr key={index}>
                  <td>{item.location}</td>
                  <td>{item.address}</td>
                  <td>{new Date(item.booked_time).toLocaleString()}</td>
                  <td>{new Date(item.leaving_time).toLocaleString()}</td>
                  <td>{item.days_spent}</td>
                  <td>₹{item.amount_spent.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty-state">You have no completed bookings to summarize.</p>
        )}
      </div>
    </div>
  );
};

export default UserSummary;
