import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar, Pie, Line, Chart } from 'react-chartjs-2';
import './Dashboard.css';
import Swal from 'sweetalert2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function Dashboard() {
    const username = localStorage.getItem('username');
    const [stats, setStats] = useState({
        users: 0,
        categories: 0,
        products: 0,
        tables: 0,
        orders: 0,
        revenue: 0,
        revenueByMonth: [],
        topProducts: [],
        ordersByMonth: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Fetching stats with token:', token);

                const response = await axios.get('http://localhost:5000/api/dashboard/stats', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                console.log('Raw response:', response);
                
                if (response.data.success) {
                    console.log('Setting stats:', response.data.data);
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
                if (error.response) {
                    console.log('Error response:', error.response.data);
                }
            }
        };

        fetchStats();
    }, []);
    
    // Format số tiền thành VND
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const revenueChartData = {
        labels: stats.revenueByMonth?.map(item => item.month) || [],
        datasets: [{
            label: 'Doanh thu theo tháng',
            data: stats.revenueByMonth?.map(item => item.revenue) || [],
            backgroundColor: 'rgba(242, 129, 35, 0.5)',
            borderColor: 'rgb(242, 129, 35)',
            borderWidth: 1
        }]
    };

    const revenueChartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5,
        plugins: {
            legend: {
                position: 'top',
            }
        }
    };

    const topProductsData = {
        labels: stats.topProducts?.map(item => item.name) || [],
        datasets: [{
            label: 'Sản phẩm bán chạy',
            data: stats.topProducts?.map(item => item.total_sold) || [],
            backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF'
            ]
        }]
    };

    const topProductsOptions = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5,
        plugins: {
            legend: {
                position: 'right'
            }
        }
    };

    const ordersByMonthData = {
        labels: stats.ordersByMonth?.map(item => item.month) || [],
        datasets: [{
            label: 'Số đơn hàng',
            data: stats.ordersByMonth?.map(item => item.count) || [],
            borderColor: '#2ecc71',
            backgroundColor: '#2ecc71',
            tension: 0.4,
            fill: false
        }]
    };

    const ordersByMonthOptions = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5,
        plugins: {
            legend: {
                position: 'top'
            }
        }
    };

    const mixedChartData = {
        labels: stats.revenueByMonth?.map(item => item.month) || [],
        datasets: [
            {
                type: 'line',
                label: 'Doanh thu',
                data: stats.revenueByMonth?.map(item => item.revenue) || [],
                borderColor: '#F28123',
                backgroundColor: 'rgba(242, 129, 35, 0.1)',
                yAxisID: 'y',
                tension: 0.4,
                fill: true
            },
            {
                type: 'bar',
                label: 'Số đơn hàng',
                data: stats.ordersByMonth?.map(item => item.count) || [],
                backgroundColor: 'rgba(46, 204, 113, 0.6)',
                yAxisID: 'y1',
                borderRadius: 4
            }
        ]
    };

    const mixedChartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5,
        plugins: {
            legend: {
                position: 'top',
                align: 'start'
            },
            title: {
                display: false
            }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                ticks: {
                    callback: function(value) {
                        return formatCurrency(value);
                    }
                }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false
                },
                ticks: {
                    stepSize: 1
                }
            }
        }
    };

    const handleExportOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/dashboard/export/orders', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Orders__namn44241.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting orders:', error);
            Swal.fire('Lỗi', 'Không thể xuất dữ liệu đơn hàng', 'error');
        }
    };

    const handleExportRevenue = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/dashboard/export/revenue', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Revenue_Foodee_namn44241.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting revenue:', error);
            Swal.fire('Lỗi', 'Không thể xuất dữ liệu doanh thu', 'error');
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <div className="header-content">
                    <h2>Bảng điều khiển</h2>
                    <p>Xin chào, {username}!</p>
                </div>
                <div className="export-buttons">
                    <button className="btn btn-primary me-2" onClick={handleExportOrders}>
                        <i className="fas fa-file-export me-2"></i>
                        Xuất đơn hàng
                    </button>
                    <button className="btn btn-success" onClick={handleExportRevenue}>
                        <i className="fas fa-chart-line me-2"></i>
                        Xuất doanh thu
                    </button>
                </div>
            </div>
            
            <div className="dashboard-stats">
                <div className="stat-card">
                    <i className="fas fa-users"></i>
                    <h3>Nhân viên</h3>
                    <p>{stats.users}</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-list"></i>
                    <h3>Danh mục</h3>
                    <p>{stats.categories}</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-utensils"></i>
                    <h3>Món ăn</h3>
                    <p>{stats.products}</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-chair"></i>
                    <h3>Bàn</h3>
                    <p>{stats.tables}</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-receipt"></i>
                    <h3>Đơn hàng</h3>
                    <p>{stats.orders}</p>
                </div>
                <div className="stat-card">
                    <i className="fas fa-dollar-sign"></i>
                    <h3>Doanh thu</h3>
                    <p>{formatCurrency(stats.revenue)}</p>
                </div>
            </div>
            
            <div className="dashboard-charts">
                <div className="chart-container">
                    <h3>Doanh thu theo tháng</h3>
                    <Bar data={revenueChartData} options={revenueChartOptions} id="revenue-chart" />
                </div>
                <div className="chart-container">
                    <h3>Top sản phẩm bán chạy</h3>
                    <Pie data={topProductsData} options={topProductsOptions} id="products-chart" />
                </div>
                <div className="chart-container">
                    <h3>Số đơn hàng theo tháng</h3>
                    <Line data={ordersByMonthData} options={ordersByMonthOptions} id="orders-chart" />
                </div>
                <div className="chart-container">
                    <h3>Doanh thu và số đơn hàng theo tháng</h3>
                    <Chart type="scatter" data={mixedChartData} options={mixedChartOptions} />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;