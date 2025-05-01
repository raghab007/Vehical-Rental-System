import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  FiUsers, FiCalendar, FiPieChart, FiBarChart2, FiDollarSign
} from 'react-icons/fi';
import { 
  FaCar, FaCarSide, FaCarAlt, FaTachometerAlt, FaCoins, FaRegCalendarAlt
} from 'react-icons/fa';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [userRentals, setUserRentals] = useState([]);
  const [rentalsByType, setRentalsByType] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = `Bearer ${localStorage.getItem("token")}`
      try {
        const [statsRes, vehiclesRes, userRentalsRes, rentalsByTypeRes] = await Promise.all([
          axios.get('http://localhost:4000/admin/dashboard/stats', {
            headers: {
              Authorization: token
            }
          }),
          axios.get('http://localhost:4000/admin/dashboard/vehicles', {
            headers: {
              Authorization: token
            }
          }),
          axios.get('http://localhost:4000/admin/dashboard/user-rentals', {
            headers: {
              Authorization: token
            }
          }),
          axios.get('http://localhost:4000/admin/dashboard/rentals-by-type', {
            headers: {
              Authorization: token
            }
          })
        ]);
        
        setStats(statsRes.data);
        setVehicles(vehiclesRes.data);
        setUserRentals(userRentalsRes.data);
        setRentalsByType(rentalsByTypeRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Prepare data for Chart.js charts
  const vehicleChartData = {
    labels: vehicles.slice(0, 10).map(v => v.vehicleName),
    datasets: [
      {
        label: 'Available',
        data: vehicles.slice(0, 10).map(v => v.available),
        backgroundColor: '#34D399',
        borderRadius: 4,
      },
      {
        label: 'Rented',
        data: vehicles.slice(0, 10).map(v => v.rented),
        backgroundColor: '#F87171',
        borderRadius: 4,
      }
    ]
  };

  const rentalsByTypeData = {
    labels: rentalsByType.map(item => item.name),
    datasets: [
      {
        data: rentalsByType.map(item => item.rentals),
        backgroundColor: [
          '#3B82F6', // Blue
          '#10B981', // Green
          '#F59E0B', // Amber
          '#EF4444', // Red
          '#8B5CF6', // Purple
          '#14B8A6', // Teal
          '#EC4899', // Pink
          '#6366F1'  // Indigo
        ],
        borderWidth: 1,
      }
    ]
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="text-xl flex items-center">
          <FaTachometerAlt className="text-blue-600 mr-2 animate-pulse" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex items-center mb-8">
        <FaCarSide className="text-blue-600 text-3xl mr-3" />
        <h2 className="text-3xl font-bold text-blue-800">Admin Dashboard </h2>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<FiUsers className="text-blue-600" size={24} />} 
          title="Active Customers" 
          value={stats?.totalUsers} 
          color="bg-gradient-to-br from-blue-50 to-blue-100"
          borderColor="border-blue-200"
        />
        <StatCard 
          icon={<FaCar className="text-green-600" size={24} />} 
          title="Total Vehicles" 
          value={stats?.totalVehicles} 
          color="bg-gradient-to-br from-green-50 to-green-100"
          borderColor="border-green-200"
        />
        <StatCard 
          icon={<FaRegCalendarAlt className="text-purple-600" size={24} />} 
          title="Total Rentals" 
          value={stats?.totalRentals} 
          color="bg-gradient-to-br from-purple-50 to-purple-100"
          borderColor="border-purple-200"
        />
        <StatCard 
          icon={<FaCoins className="text-amber-600" size={24} />} 
          title="Total Revenue" 
          value={`Rs ${stats?.totalRevenue?.toLocaleString() || 0}`} 
          color="bg-gradient-to-br from-amber-50 to-amber-100"
          borderColor="border-amber-200"
        />
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Vehicle Availability Chart - Chart.js Bar Chart */}
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaCarAlt className="mr-2 text-blue-600" /> Fleet Availability Status
          </h3>
          <div className="h-80">
            <Bar
              data={vehicleChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                  }
                },
                scales: {
                  x: {
                    ticks: {
                      maxRotation: 45,
                      minRotation: 45
                    }
                  },
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>
        
        {/* Rentals by Vehicle Type - Chart.js Pie Chart */}
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiPieChart className="mr-2 text-blue-600" /> Rentals by Vehicle Category
          </h3>
          <div className="h-80">
            <Pie
              data={rentalsByTypeData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
      
      {/* Additional Charts - Keeping the Recharts Area Chart */}
      <div className="grid grid-cols-1 gap-6">
        {/* Top Users by Rentals */}
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FiUsers className="mr-2 text-blue-600" /> Top Customers by Rental Frequency
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={userRentals}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  formatter={(value, name, props) => [
                    value, 
                    `Rentals by ${props.payload.name} (${props.payload.email})`
                  ]}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="rentals" 
                  name="Rentals" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon, title, value, color, borderColor }) => (
  <div className={`${color} p-6 rounded-lg shadow-md ${borderColor} border flex items-center transition-all hover:shadow-lg`}>
    <div className="p-3 bg-white rounded-full shadow-sm mr-4">
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default Dashboard;