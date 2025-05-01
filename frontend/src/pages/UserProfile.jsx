import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, LogOut, Calendar, Check, MapPin, Phone, Mail, Clock, AlertCircle, ChevronDown, ChevronUp, X } from "lucide-react";
import { useRecoilState } from "recoil";
import { userSelector } from "../store/atoms";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const UserProfile = () => {
  const [user, setUser] = useRecoilState(userSelector);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [newEndTime, setNewEndTime] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedRental, setExpandedRental] = useState(null);
  const [rentalExtensions, setRentalExtensions] = useState({});
  const [toast, setToast] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [currentExtensionId, setCurrentExtensionId] = useState(null);
  const navigate = useNavigate();

  // Show toast message
  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Show confirmation modal
  const showConfirmation = (title, message, onConfirm) => {
    setModalContent({
      title,
      message,
      onConfirm,
      onCancel: () => setShowConfirmModal(false)
    });
    setShowConfirmModal(true);
  };

  // Get the end time from the rental (without considering extensions)
  const getRentalEndTime = (rental) => {
    return new Date(rental.endTime);
  };

  // Get rental status based on the status field
  const getRentalStatus = (rental) => {
    const isActive = rental.status === 'active';
    const endTime = getRentalEndTime(rental);
    
    return {
      status: rental.status,
      color: isActive ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800',
      endTime: endTime
    };
  };

  // Sort rentals by createdAt (newest first) and group completed at bottom
  const sortAndGroupRentals = (rentalsData) => {
    const completedRentals = [];
    const activeRentals = [];
    
    rentalsData.forEach(rental => {
      if (rental.status === 'completed') {
        completedRentals.push(rental);
      } else {
        activeRentals.push(rental);
      }
    });

    // Sort each group by createdAt (newest first)
    const sortByCreatedAt = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
    activeRentals.sort(sortByCreatedAt);
    completedRentals.sort(sortByCreatedAt);

    return [...activeRentals, ...completedRentals];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch rentals
        const rentalsResponse = await axios.get("http://localhost:4000/rental/rentals", {
          headers: { Authorization: `Bearer ${token}` }
        });

        let rentalsData = rentalsResponse.data.data || [];
        
        // Fetch extensions for each rental
        const extensionsMap = {};
        for (const rental of rentalsData) {
          try {
            const extensionsResponse = await axios.get(
              `http://localhost:4000/api/extension/rental/${rental.id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            extensionsMap[rental.id] = extensionsResponse.data || [];
          } catch (error) {
            console.error(`Error fetching extensions for rental ${rental.id}:`, error);
            extensionsMap[rental.id] = [];
          }
        }
        setRentalExtensions(extensionsMap);
        
        // Sort rentals by createdAt and group completed at bottom
        rentalsData = sortAndGroupRentals(rentalsData);
        setRentals(rentalsData);

        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to load data");
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up interval to check rental statuses periodically (every minute)
    const intervalId = setInterval(fetchData, 60000);
    
    return () => clearInterval(intervalId);
  }, [navigate]);

  const hasPendingExtension = (rentalId) => {
    const extensions = rentalExtensions[rentalId] || [];
    return extensions.some(ext => ext.status === 'pending');
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotal = (pricePerHour, startTime, endTime) => {
    const hours = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);
    return (hours * pricePerHour).toFixed(2);
  };

  const handleRequestExtension = (rental) => {
    if (hasPendingExtension(rental.id)) {
      showToast("You already have a pending extension request for this rental", "warning");
      return;
    }
    setSelectedRental(rental);
    setShowExtensionModal(true);
    setNewEndTime("");
  };

  const submitExtensionRequest = async () => {
    if (!newEndTime) {
      showToast("Please select a new end time", "error");
      return;
    }

    const additionalAmount = calculateAdditionalAmount();

    try {
      setIsProcessing(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.post(
        "http://localhost:4000/api/extension/request",
        { 
          rentalId: selectedRental.id,
          requestedEndTime: newEndTime,
          additionalAmount: additionalAmount
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast("Extension request submitted for admin approval", "success");
      setShowExtensionModal(false);
      
      // Update local state with the new extension
      const updatedExtensions = { ...rentalExtensions };
      if (!updatedExtensions[selectedRental.id]) {
        updatedExtensions[selectedRental.id] = [];
      }
      updatedExtensions[selectedRental.id].push(response.data.extensionRequest);
      setRentalExtensions(updatedExtensions);

    } catch (error) {
      console.error("Extension request failed:", error);
      const errorMsg = error.response?.data?.error || "Failed to request extension";
      const minTime = error.response?.data?.minExtensionTime;
      
      if (minTime) {
        showToast(`Extension must be at least until ${formatDate(minTime)}`, "error");
      } else {
        showToast(errorMsg, "error");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const initiatePaymentForExtension = (extensionId) => {
    localStorage.setItem('currentExtensionId', extensionId);
    setCurrentExtensionId(extensionId);
    showConfirmation(
      "Confirm Payment",
      "You will be redirected to the payment gateway. Continue?",
      () => handlePayForExtension(extensionId)
    );
  };

  const handlePayForExtension = async (extensionId) => {
    try {
      setIsProcessing(true);
      const token = localStorage.getItem("token");
      
      const paymentResponse = await axios.post(
        "http://localhost:4000/api/extension/pay",
        { extensionId: extensionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      window.location.href = paymentResponse.data.payment_url;

    } catch (error) {
      console.error("Payment initiation failed:", error);
      showToast(error.response?.data?.error || "Failed to initiate payment", "error");
    } finally {
      setIsProcessing(false);
      setCurrentExtensionId(null);
    }
  };

  const getMinExtensionTime = () => {
    if (!selectedRental) return "";
    
    // Use the rental's original end time as the minimum extension time
    const baseEndTime = new Date(selectedRental.endTime);
    baseEndTime.setHours(baseEndTime.getHours() + 1);
    return baseEndTime.toISOString().slice(0, 16);
  };

  const calculateAdditionalAmount = () => {
    if (!selectedRental || !newEndTime) return 0;
    
    // Calculate from the rental's original end time to the new end time
    const baseEndTime = new Date(selectedRental.endTime);
    const hours = (new Date(newEndTime) - baseEndTime) / (1000 * 60 * 60);
    return (hours * selectedRental.vehicle.pricePerHour).toFixed(2);
  };

  const toggleRentalExpansion = (rentalId) => {
    setExpandedRental(expandedRental === rentalId ? null : rentalId);
  };

  const getStatusBadge = (extension) => {
    if (extension.status === 'approved' && extension.paymentStatus === 'paid') {
      return { text: 'Completed', color: 'bg-green-100 text-green-800' };
    }
    if (extension.status === 'approved' && extension.paymentStatus !== 'paid') {
      return { text: 'Payment Required', color: 'bg-blue-100 text-blue-800' };
    }
    if (extension.status === 'pending') {
      return { text: 'Pending Approval', color: 'bg-yellow-100 text-yellow-800' };
    }
    if (extension.status === 'rejected') {
      return { text: 'Rejected', color: 'bg-red-100 text-red-800' };
    }
    return { text: 'Unknown', color: 'bg-gray-100 text-gray-800' };
  };

  const shouldShowPayButton = (extension) => {
    return extension.status === 'approved' && extension.paymentStatus !== 'paid';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center 
          ${toast.type === 'error' ? 'bg-red-100 text-red-800' : 
            toast.type === 'success' ? 'bg-green-100 text-green-800' : 
            toast.type === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-blue-100 text-blue-800'}`}>
          <span>{toast.message}</span>
          <button 
            onClick={() => setToast(null)} 
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-center relative">
          <button 
            onClick={logout}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-colors duration-200"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
          
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 rounded-full bg-blue-400 flex items-center justify-center text-white shadow-lg">
              <User size={64} />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            {user?.firstName} {user?.lastName}
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4 text-blue-100 mt-4">
            <div className="flex items-center space-x-2">
              <Mail size={16} />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone size={16} />
              <span>{user?.contactNumber}</span>
            </div>
            {user?.address && (
              <div className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>{user.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Rental History */}
        <div className="p-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <Calendar className="mr-4 text-blue-600" size={28} />
            Rental History
          </h3>

          {loading ? (
            <div className="text-center bg-gray-100 rounded-xl p-8">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center bg-gray-100 rounded-xl p-8">
              <p className="text-red-500 flex items-center justify-center">
                <AlertCircle className="mr-2" size={18} />
                {error}
              </p>
            </div>
          ) : rentals.length > 0 ? (
            <div className="space-y-4">
              {rentals.map((rental) => {
                const rentalStatus = getRentalStatus(rental);
                const isCompleted = rentalStatus.status === 'completed';
                const endTime = rentalStatus.endTime;
                
                return (
                  <div 
                    key={rental.id} 
                    className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ${
                      isCompleted ? 'opacity-90' : ''
                    }`}
                  >
                    {isCompleted && (
                      <div className="mb-2 text-sm text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded">Completed</span>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <div className="flex flex-col md:flex-row md:justify-between gap-4">
                        <div>
                          <h4 className="font-bold text-gray-800 text-lg">
                            {rental.vehicle.vehicleName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {rental.vehicle.company} • {rental.vehicle.model}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Booked on: {formatDate(rental.createdAt)}
                          </p>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${rentalStatus.color}`}>
                          {rentalStatus.status === 'completed' ? (
                            <Check className="text-green-600" size={16} />
                          ) : (
                            <AlertCircle className="text-blue-600" size={16} />
                          )}
                          {rentalStatus.status}
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">Start Date</span>
                          <span className="font-medium">{formatDate(rental.startTime)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">End Date</span>
                          <span className="font-medium">{formatDate(endTime)}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">Price</span>
                          <span className="font-medium">Rs. {rental.vehicle.pricePerHour}/hour</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">Total</span>
                          <span className="font-medium">
                            Rs. {calculateTotal(
                              rental.vehicle.pricePerHour, 
                              rental.startTime, 
                              endTime
                            )}
                          </span>
                        </div>
                      </div>

                      {rentalStatus.status === 'active' && (
                        <div className="mt-4 flex justify-between items-center">
                          <button
                            onClick={() => handleRequestExtension(rental)}
                            disabled={hasPendingExtension(rental.id)}
                            className={`px-4 py-2 rounded transition-colors duration-200 ${
                              hasPendingExtension(rental.id)
                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }`}
                          >
                            {hasPendingExtension(rental.id) ? 'Extension Pending' : 'Request Extension'}
                          </button>
                          
                          <button 
                            onClick={() => toggleRentalExpansion(rental.id)}
                            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
                          >
                            {expandedRental === rental.id ? (
                              <>
                                <span>Hide Extensions</span>
                                <ChevronUp className="ml-1" size={18} />
                              </>
                            ) : (
                              <>
                                <span>View Extensions</span>
                                <ChevronDown className="ml-1" size={18} />
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {expandedRental === rental.id && (
                        <div className="mt-4">
                          <h4 className="font-medium text-gray-700 mb-2">Extension Requests:</h4>
                          {rentalExtensions[rental.id]?.length > 0 ? (
                            <div className="space-y-3">
                              {rentalExtensions[rental.id].map((extension) => {
                                const status = getStatusBadge(extension);
                                
                                return (
                                  <div key={extension.id} className="p-3 border rounded-lg bg-gray-50">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="font-medium">Requested End Time: {formatDate(extension.requestedEndTime)}</p>
                                        <p className="text-sm">Additional Amount: Rs. {extension.additionalAmount}</p>
                                      </div>
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                        {status.text}
                                      </span>
                                    </div>
                                    
                                    {shouldShowPayButton(extension) && (
                                      <button
                                        onClick={() => initiatePaymentForExtension(extension.id)}
                                        disabled={isProcessing}
                                        className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white py-1 rounded disabled:bg-green-300 text-sm transition-colors duration-200"
                                      >
                                        {isProcessing ? 'Processing...' : 'Pay Now'}
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-gray-500">No extension requests found</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center bg-gray-100 rounded-xl p-8">
              <p className="text-gray-500 flex items-center justify-center">
                <Calendar className="mr-2" size={18} />
                No rentals found.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Extension Request Modal */}
      {showExtensionModal && selectedRental && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Extend Rental Period</h3>
              <button 
                onClick={() => setShowExtensionModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current End Time</label>
                <p className="font-medium">{formatDate(selectedRental.endTime)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New End Time</label>
                <input
                  type="datetime-local"
                  value={newEndTime}
                  min={getMinExtensionTime()}
                  onChange={(e) => setNewEndTime(e.target.value)}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum extension is 1 hour from current end time
                </p>
              </div>
              
              {newEndTime && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Additional amount: Rs. {calculateAdditionalAmount()}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowExtensionModal(false)}
                disabled={isProcessing}
                className="px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={submitExtensionRequest}
                disabled={isProcessing || !newEndTime}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors duration-200"
              >
                {isProcessing ? 'Processing...' : 'Request Extension'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{modalContent.title}</h3>
              <button 
                onClick={modalContent.onCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="mb-6">{modalContent.message}</p>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={modalContent.onCancel}
                className="px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={modalContent.onConfirm}
                disabled={isProcessing}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors duration-200"
              >
                {isProcessing ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;