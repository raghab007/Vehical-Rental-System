import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO, isPast } from 'date-fns';

function Rentals() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('status'); // Default sort by status
  const [sortDirection, setSortDirection] = useState('asc');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await axios.get('http://localhost:4000/admin/rentals', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Ensure each rental has a vehicle object
      const safeRentals = response.data.map(rental => ({
        ...rental,
        vehicle: rental.vehicle || {
          id: rental.vehicleId,
          vehicleName: 'Unknown Vehicle',
          available: 0,
          rented: 0
        }
      }));
      
      setRentals(safeRentals);
      setLoading(false);
    } catch (err) {
      setError('Failed to load rentals. Please check your connection and login status.');
      setLoading(false);
      console.error('Error fetching rentals:', err);
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await fetchRentals();
    setTimeout(() => setIsRefreshing(false), 500); // Show refresh animation for at least 500ms
  };

  const markAsCompleted = async (rentalId) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await axios.patch(
        `http://localhost:4000/admin/rentals/${rentalId}/complete`, 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.message) {
        // Refresh the data to show updated counts
        await fetchRentals();
        
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300 ease-out';
        successDiv.innerText = response.data.message;
        document.body.appendChild(successDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
          successDiv.style.transform = 'translateY(100%)';
          setTimeout(() => document.body.removeChild(successDiv), 300);
        }, 3000);
      } else {
        alert('Rental marked as completed successfully!');
      }
    } catch (err) {
      alert(err.response?.data || 'Failed to update rental status.');
      console.error('Error updating rental:', err);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedRentals = rentals
    .filter(rental => {
      const matchesSearch = 
        rental.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.id.toString().includes(searchTerm) ||
        rental.vehicle.vehicleName.toLowerCase().includes(searchTerm.toLowerCase());
        
      if (filterStatus === 'all') return matchesSearch;
      if (filterStatus === 'active') return rental.status === 'active' && matchesSearch;
      if (filterStatus === 'completed') return rental.status === 'completed' && matchesSearch;
      if (filterStatus === 'unpaid') return rental.paymentStatus === 'unpaid' && matchesSearch;
      if (filterStatus === 'overdue') {
        return rental.status === 'active' && 
               isPast(parseISO(rental.endTime)) && 
               matchesSearch;
      }
      return matchesSearch;
    })
    .sort((a, b) => {
      // First sort by status (active rentals first)
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      
      // Then sort by the selected field
      let valueA, valueB;
      
      switch (sortField) {
        case 'id':
          valueA = a.id;
          valueB = b.id;
          break;
        case 'user':
          valueA = a.user.firstName.toLowerCase();
          valueB = b.user.firstName.toLowerCase();
          break;
        case 'vehicle':
          valueA = a.vehicle.vehicleName.toLowerCase();
          valueB = b.vehicle.vehicleName.toLowerCase();
          break;
        case 'amount':
          valueA = a.amount;
          valueB = b.amount;
          break;
        case 'startTime':
          valueA = new Date(a.startTime);
          valueB = new Date(b.startTime);
          break;
        case 'endTime':
          valueA = new Date(a.endTime);
          valueB = new Date(b.endTime);
          break;
        case 'status':
          valueA = a.status;
          valueB = b.status;
          break;
        case 'paymentStatus':
          valueA = a.paymentStatus;
          valueB = b.paymentStatus;
          break;
        default:
          valueA = a[sortField];
          valueB = b[sortField];
      }
      
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

  const formatDate = (dateString) => {
    return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
  };

  const isOverdue = (endTime) => {
    return isPast(parseISO(endTime));
  };

  const shouldShowCompleteButton = (rental) => {
    return rental.status === 'active' && isPast(parseISO(rental.endTime));
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Rental Management
        </h1>
        
        <div className="mt-4 md:mt-0">
          <button
            className={`flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out ${isRefreshing ? 'opacity-75' : ''}`}
            onClick={refreshData}
            disabled={isRefreshing}
          >
            <svg 
              className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6 shadow-sm animate-fadeIn">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
            {error}
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="w-full pl-10 p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                placeholder="Search by user, vehicle, or rental ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter Status</label>
            <select
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white transition duration-150"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Rentals</option>
              <option value="active">Active Only</option>
              <option value="completed">Completed Only</option>
              <option value="unpaid">Unpaid Only</option>
              <option value="overdue">Overdue Only</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white transition duration-150"
              value={sortField}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="id">Rental ID</option>
              <option value="user">User Name</option>
              <option value="vehicle">Vehicle</option>
              <option value="rented time">Rented time</option>
              <option value="startTime">Start Time</option>
              <option value="endTime">End Time</option>
              <option value="amount">Amount</option>
              <option value="status">Status</option>
              <option value="paymentStatus">Payment Status</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <select
              className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white transition duration-150"
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-end pt-2 border-t border-gray-100">
          <span className="text-gray-600 text-sm">
            <span className="font-medium">{filteredAndSortedRentals.length}</span> rentals found
          </span>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600 font-medium">Loading rentals...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Rented Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Start Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    End Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedRentals.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20h.01M12 14h.01M12 8h.01M12 4h.01"></path>
                        </svg>
                        <p className="text-gray-500 font-medium">No rentals found matching your criteria.</p>
                        <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedRentals.map((rental) => (
                    <tr key={rental.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{rental.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{rental.user.firstName} {rental.user.lastName}</div>
                        <div className="text-xs text-gray-500">{rental.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{rental.vehicle.vehicleName}</div>
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <span className="inline-flex items-center mr-2">
                            <span className="h-2 w-2 rounded-full bg-green-400 mr-1"></span>
                            {rental.vehicle.available} available
                          </span>
                          <span className="inline-flex items-center">
                            <span className="h-2 w-2 rounded-full bg-blue-400 mr-1"></span>
                            {rental.vehicle.rented} rented
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(rental.createdAt)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(rental.startTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={isOverdue(rental.endTime) && rental.status === 'active' ? "text-red-600 font-medium" : "text-gray-500"}>
                          {formatDate(rental.endTime)}
                          {isOverdue(rental.endTime) && rental.status === 'active' && (
                            <span className="block text-xs text-red-500 mt-1">
                              Overdue
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Rs {rental.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          rental.status === 'active' 
                            ? isOverdue(rental.endTime) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            : rental.status === 'completed' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {rental.status === 'active' && isOverdue(rental.endTime) 
                            ? (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                </svg>
                                Overdue
                              </>
                            ) 
                            : rental.status === 'active' ? (
                              <>
                                <span className="flex h-2 w-2 relative mr-1">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Active
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                </svg>
                                Completed
                              </>
                            )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          rental.paymentStatus === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {rental.paymentStatus === 'paid' ? (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                              </svg>
                              Paid
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                              </svg>
                              Unpaid
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {shouldShowCompleteButton(rental) && (
                            <button
                              onClick={() => markAsCompleted(rental.id)}
                              className="inline-flex items-center bg-amber-500 hover:bg-amber-600 text-white py-1.5 px-3 rounded-md text-xs transition duration-150 shadow-sm"
                            >
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                              Complete
                            </button>
                          )}
                          <button
                            onClick={() => alert(`View details for rental #${rental.id}`)}
                            className="inline-flex items-center text-indigo-600 hover:text-indigo-900 transition duration-150 text-xs"
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in;
        }
      `}</style>
    </div>
  );
}

export default Rentals;