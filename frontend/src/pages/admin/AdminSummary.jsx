
import React, { useState, useEffect } from 'react';
import './TablePages.css';
import { Bar, Doughnut } from 'react-chartjs-2';
import api from '../../services/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const AdminSummary = () => {
    const [summary, setSummary] = useState([]);
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await api.get('/api/summary');
                const summaryData = response.data.summary || [];
                setSummary(summaryData);
                processChartData(summaryData);
            } catch (error) {
                console.error("Failed to fetch summary:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    const processChartData = (summaryData) => {
        const labels = summaryData.map(item => item.lot_location);

        // --- Chart 1: Spots Status by Location ---
        const spotsStatusData = {
            labels,
            datasets: [
                {
                    label: 'Occupied Spots',
                    data: summaryData.map(item => item.occupied_spots),
                    backgroundColor: 'rgba(220, 53, 69, 0.7)',
                    borderColor: 'rgba(220, 53, 69, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Available Spots',
                    data: summaryData.map(item => item.available_spots),
                    backgroundColor: 'rgba(40, 167, 69, 0.7)',
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 1,
                },
            ],
        };

        // --- Chart 2: Revenue by Location ---
        const revenueData = {
            labels,
            datasets: [{
                label: 'Total Earned (₹)',
                data: summaryData.map(item => item.total_earned_cost),
                backgroundColor: 'rgba(0, 123, 255, 0.7)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1,
            }],
        };

        // --- Chart 3: Overall Spot Distribution (Doughnut) ---
        const totalOccupied = summaryData.reduce((sum, item) => sum + item.occupied_spots, 0);
        const totalAvailable = summaryData.reduce((sum, item) => sum + item.available_spots, 0);
        const overallDistributionData = {
            labels: ['Occupied', 'Available'],
            datasets: [{
                data: [totalOccupied, totalAvailable],
                backgroundColor: ['rgba(220, 53, 69, 0.8)', 'rgba(40, 167, 69, 0.8)'],
                borderColor: ['#ffffff', '#ffffff'],
                borderWidth: 2,
            }],
        };

        setChartData({ spotsStatusData, revenueData, overallDistributionData });
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: false },
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    if (loading) {
        return (
            <div className="loading-spinner-wrapper">
                <div className="loading-spinner"></div>
            </div>
        );
    }
    
    return (
        <div className="table-container">
            <h1>System Summary Dashboard</h1>
            
            <div className="summary-dashboard">
                <div className="summary-charts-grid">
                    <div className="chart-container">
                        <h2>Spots Status by Location</h2>
                        {chartData.spotsStatusData && <Bar options={chartOptions} data={chartData.spotsStatusData} />}
                    </div>
                    <div className="chart-container">
                        <h2>Revenue by Location</h2>
                        {chartData.revenueData && <Bar options={chartOptions} data={chartData.revenueData} />}
                    </div>
                    <div className="chart-container">
                        <h2>Overall Spot Distribution</h2>
                        <div className="doughnut-chart-container">
                            {chartData.overallDistributionData && <Doughnut data={chartData.overallDistributionData} />}
                        </div>
                    </div>
                </div>

                <div className="table-section">
                    <h2 className="table-section-header">Detailed Data Breakdown</h2>
                    <div className="table-wrapper">
                        {summary.length > 0 ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Lot ID</th>
                                        <th>Location</th>
                                        <th>Total Spots</th>
                                        <th>Available</th>
                                        <th>Occupied</th>
                                        <th>In Use</th>
                                        <th>Completed</th>
                                        <th>Total Days</th>
                                        <th>Total Earned</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {summary.map(item => (
                                        <tr key={item.lot_id}>
                                            <td>{item.lot_id}</td>
                                            <td>{item.lot_location}</td>
                                            <td>{item.total_spots}</td>
                                            <td>{item.available_spots}</td>
                                            <td>{item.occupied_spots}</td>
                                            <td>{item.currently_in_use}</td>
                                            <td>{item.completed_bookings}</td>
                                            <td>{item.total_registered_days}</td>
                                            <td>₹{item.total_earned_cost.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                             <div className="empty-state">
                                <p className="empty-state-text">No summary data available to display.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default AdminSummary;