import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const CarDetailPage = () => {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [timeDifference, setTimeDifference] = useState({
    hours: 0,
    minutes: 0,
    totalHours: 0,
    isValid: false
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isExtension, setIsExtension] = useState(false);
  const [originalEndDateTime, setOriginalEndDateTime] = useState(null);
  const { carId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/vehicle/get/${carId}`);
        setVehicle(response.data);
        
        // Check if this is an extension request
        const rentalId = localStorage.getItem("rentalId");
        if (rentalId) {
          const rentalRes = await axios.get(`http://localhost:4000/api/rentals/${rentalId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          });
          if (rentalRes.data.vehicleId === carId) {
            setIsExtension(true);
            setOriginalEndDateTime(rentalRes.data.endDateTime);
            setStartDateTime(rentalRes.data.endDateTime);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load vehicle data");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleData();
  }, [carId]);

  useEffect(() => {
    if (vehicle && startDateTime && endDateTime) {
      const startDateObj = new Date(startDateTime);
      const endDateObj = new Date(endDateTime);
      
      // Ensure we always calculate from the earlier date to the later date
      const diffInMs = Math.abs(endDateObj - startDateObj);
      const diffInHours = diffInMs / (1000 * 60 * 60);
      const hours = Math.floor(diffInHours);
      const minutes = Math.round((diffInHours - hours) * 60);

      // For extensions, minimum duration is 1 hour and must be after original end time
      const isValid = isExtension 
        ? (diffInMs >= 60 * 60 * 1000 && endDateObj > new Date(originalEndDateTime))
        : diffInMs >= 60 * 60 * 1000;

      const price = diffInHours * vehicle.pricePerHour;

      setTimeDifference({
        hours,
        minutes,
        totalHours: diffInHours,
        isValid
      });
      setTotalPrice(price);
    } else {
      setTimeDifference({
        hours: 0,
        minutes: 0,
        totalHours: 0,
        isValid: false
      });
      setTotalPrice(0);
    }
  }, [startDateTime, endDateTime, vehicle, isExtension, originalEndDateTime]);

  const handleStartDateTimeChange = (e) => {
    if (!isLoggedIn) {
      showNotification("Please login to select dates", "error");
      return;
    }

    const selectedDateTime = e.target.value;
    const now = new Date();
    const selectedDate = new Date(selectedDateTime);

    if (!isExtension && selectedDate < now) {
      showNotification("Start date/time cannot be in the past", "error");
      return;
    }

    setStartDateTime(selectedDateTime);

    if (endDateTime && new Date(endDateTime) <= selectedDate) {
      setEndDateTime("");
    }
  };

  const handleEndDateTimeChange = (e) => {
    if (!isLoggedIn) {
      showNotification("Please login to select dates", "error");
      return;
    }

    const selectedDateTime = e.target.value;
    const selectedDate = new Date(selectedDateTime);
    const startDate = new Date(startDateTime);

    if (!startDateTime) {
      showNotification("Please select start date/time first", "error");
      return;
    }

    if (isExtension) {
      // For extensions, must be after original end time
      const originalEndDate = new Date(originalEndDateTime);
      if (selectedDate <= originalEndDate) {
        showNotification("Extension must be after the current rental end time", "error");
        return;
      }
    }

    if ((selectedDate - startDate) < 60 * 60 * 1000) {
      showNotification("Minimum booking duration is 1 hour", "error");
      return;
    }

    setEndDateTime(selectedDateTime);
  };

  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleLoginRedirect = () => navigate("/login");

  const getMinDateTime = () => {
    if (isExtension && originalEndDateTime) {
      return new Date(originalEndDateTime).toISOString().slice(0, 16);
    }
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);
    return now.toISOString().slice(0, 16);
  };

  const getMinEndDateTime = () => {
    if (!startDateTime) return "";
    const startDate = new Date(startDateTime);
    startDate.setHours(startDate.getHours() + 1);
    return startDate.toISOString().slice(0, 16);
  };

  const handleTermsChange = (e) => setTermsAccepted(e.target.checked);
  const openTermsModal = () => setShowTermsModal(true);
  const closeTermsModal = () => setShowTermsModal(false);

  const handleBooking = async () => {
    if (!isLoggedIn) {
      showNotification("Please login to book this vehicle", "error");
      navigate("/login");
      return;
    }

    if (vehicle.available <= 0 && !isExtension) {
      showNotification("Sorry, this vehicle is not available", "error");
      return;
    }

    if (!startDateTime || !endDateTime) {
      showNotification("Please select both start and end date/time", "error");
      return;
    }

    if (!timeDifference.isValid) {
      showNotification(isExtension 
        ? "Extension must be at least 1 hour after current rental end time" 
        : "Minimum booking duration is 60 minutes", "error");
      return;
    }

    if (!termsAccepted) {
      showNotification("Please accept the terms and conditions", "error");
      return;
    }

    try {
      const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        const pad = num => num.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
      };

      const endpoint = isExtension 
        ? "http://localhost:4000/api/rentals/extend" 
        : "http://localhost:4000/api/payment";

      const payload = isExtension
        ? {
            rentalId: localStorage.getItem("rentalId"),
            newEndDateTime: formatDateTime(endDateTime),
            additionalAmount: totalPrice
          }
        : {
            vehicleId: carId,
            startDateTime: formatDateTime(startDateTime),
            endDateTime: formatDateTime(endDateTime),
            amount: totalPrice
          };

      const response = await axios.post(
        endpoint,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
        }
      );

      showNotification(
        isExtension 
          ? "Extension request successful! Redirecting to payment..." 
          : "Booking successful! Redirecting to payment...", 
        "success"
      );
      
      if (!isExtension) {
        localStorage.setItem("rentalId", response.data.rentalId);
      }
      localStorage.setItem("amount", totalPrice);
      window.location.href = response.data.payment_url;
    } catch (error) {
      console.error("Booking error:", error);
      showNotification(
        error.response?.data?.error || "Failed to process booking",
        "error"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-xl">Loading vehicle details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  const isVehicleAvailable = vehicle?.available > 0 || isExtension;
  const isBookingDisabled = !timeDifference.isValid || (!isExtension && !isVehicleAvailable) || !isLoggedIn || !termsAccepted;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <span className="mr-1">←</span> Back to Search
        </button>
      </div>

      {isExtension && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                You are requesting an extension for your current rental. The extension must be at least 1 hour and must be after your current rental end time.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="rounded-xl overflow-hidden mb-6 shadow-lg">
            <img
              src={`http://localhost:4000/uploads/${vehicle?.imageUrl?.split("\\")[1]}`}
              alt={vehicle?.vehicleName}
              className="w-full h-[450px] object-cover"
            />
          </div>

          <div className="bg-white rounded-xl shadow-lg mb-6">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{vehicle?.vehicleName}</h1>
                  <p className="text-gray-600 mb-4">
                    {vehicle?.type} • {vehicle?.model}
                  </p>
                </div>
                <div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    isVehicleAvailable 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {isExtension 
                      ? "Extension Request" 
                      : isVehicleAvailable 
                        ? `Available: ${vehicle?.available}` 
                        : "Not available"}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              <p className="text-gray-700 mb-4">{vehicle?.description}</p>

              <div className="border-t border-gray-200 my-4"></div>

              <h3 className="text-xl font-bold mb-4">Vehicle Features</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium">{vehicle?.company}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fuel Type</p>
                  <p className="font-medium">{vehicle?.fuelType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Seating Capacity</p>
                  <p className="font-medium">{vehicle?.passengerSeat} Adults</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-lg sticky top-5">
            <h2 className="text-2xl font-bold mb-4">
              {isExtension ? "Extension Details" : "Booking Details"}
            </h2>

            {!isLoggedIn && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      You need to <button onClick={handleLoginRedirect} className="font-medium underline text-yellow-700 hover:text-yellow-600">login</button> to book this vehicle
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                isVehicleAvailable 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {isExtension 
                  ? "Extension Request" 
                  : isVehicleAvailable 
                    ? `Available: ${vehicle?.available}` 
                    : "Not available"}
              </span>
              <p className="text-3xl font-bold text-blue-600">
                Rs {vehicle?.pricePerHour?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">per hour</p>
            </div>

            <div className="border-t border-gray-200 my-4"></div>

            <h3 className="text-lg font-bold mb-4">
              {isExtension ? "Extension Dates and Times" : "Trip Dates and Times"}
            </h3>
            <div className="space-y-4 mb-6">
              {isExtension && originalEndDateTime && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Rental End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={originalEndDateTime}
                    disabled
                    className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isExtension ? "New End Date & Time" : "Start Date & Time"}
                </label>
                <input
                  type="datetime-local"
                  value={startDateTime}
                  onChange={handleStartDateTimeChange}
                  min={getMinDateTime()}
                  disabled={(!isVehicleAvailable && !isExtension) || !isLoggedIn}
                  className={`w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    (!isVehicleAvailable && !isExtension) || !isLoggedIn ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isExtension ? "Extended End Date & Time" : "End Date & Time"}
                </label>
                <input
                  type="datetime-local"
                  value={endDateTime}
                  onChange={handleEndDateTimeChange}
                  min={getMinEndDateTime()}
                  disabled={!startDateTime || (!isVehicleAvailable && !isExtension) || !isLoggedIn}
                  className={`w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    !startDateTime || (!isVehicleAvailable && !isExtension) || !isLoggedIn ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-bold mb-2">Rental Duration</h3>
              {startDateTime && endDateTime ? (
                <>
                  <p>
                    {timeDifference.hours > 0 && `${timeDifference.hours} hour${timeDifference.hours !== 1 ? 's' : ''}`}
                    {timeDifference.minutes > 0 && ` ${timeDifference.minutes} minute${timeDifference.minutes !== 1 ? 's' : ''}`}
                  </p>
                  {!timeDifference.isValid && (
                    <p className="text-red-500 text-sm mt-1">
                      {isExtension 
                        ? "Extension must be at least 1 hour after current rental end time" 
                        : "Minimum booking duration is 60 minutes"}
                    </p>
                  )}
                </>
              ) : (
                <p>Select dates to see duration</p>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-bold mb-2">Price Summary</h3>
              <div className="flex justify-between mb-2">
                <p className="text-sm">
                  Rs {vehicle?.pricePerHour?.toLocaleString()} × {timeDifference.totalHours.toFixed(2)} hours
                </p>
                <p className="text-sm">Rs {totalPrice.toFixed(2)}</p>
              </div>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="flex justify-between">
                <p className="font-bold">{isExtension ? "Additional Amount" : "Total"}</p>
                <p className="font-bold">Rs {totalPrice.toFixed(2)}</p>
              </div>
            </div>

            {isLoggedIn && (isVehicleAvailable || isExtension) && startDateTime && endDateTime && timeDifference.isValid && (
              <div className="mb-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={handleTermsChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-700">
                      I accept the{" "}
                      <button
                        type="button"
                        onClick={openTermsModal}
                        className="text-blue-600 hover:text-blue-500 underline"
                      >
                        Terms and Conditions
                      </button>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleBooking}
              disabled={isBookingDisabled}
              className={`w-full text-white font-bold py-3 px-4 rounded-lg text-lg transition duration-300 ${
                isBookingDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {!isLoggedIn 
                ? "Login to Book" 
                : !isVehicleAvailable && !isExtension
                  ? "Not Available" 
                  : !termsAccepted && startDateTime && endDateTime && timeDifference.isValid
                    ? "Accept Terms to Book"
                    : isExtension
                      ? "Request Extension"
                      : "Book Now"}
            </button>
          </div>
        </div>
      </div>

      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <h2 className="text-2xl font-bold mb-4">Terms and Conditions</h2>
              <div className="prose max-w-none">
                <h3>1. Rental Agreement</h3>
                <p>
                  This agreement is made between the vehicle rental service provider and the renter. By accepting these terms, you agree to abide by all terms and conditions outlined in this document.
                </p>
                <h3>2. Rental Period</h3>
                <p>
                  The rental period begins at the specified start date/time and ends at the specified end date/time. Extensions must be requested and approved in advance.
                </p>
                <h3>3. Payment Terms</h3>
                <p>
                  Full payment is required at the time of booking. Prices are calculated based on the hourly rate multiplied by the rental duration.
                </p>
                <h3>4. Cancellation Policy</h3>
                <p>
                  Cancellations made more than 24 hours before the rental start time will receive a full refund. Cancellations made within 24 hours are non-refundable.
                </p>
                <h3>5. Vehicle Use</h3>
                <p>
                  The vehicle must be used in accordance with all traffic laws and only by the authorized renter. Smoking and pets are not allowed in the vehicle.
                </p>
                <h3>6. Damage and Insurance</h3>
                <p>
                  The renter is responsible for any damage to the vehicle during the rental period. Insurance coverage options are available at checkout.
                </p>
                <h3>7. Extension Policy</h3>
                <p>
                  Extensions must be requested before the current rental period ends. The extension must be for a minimum of 1 hour and cannot overlap with the current rental period. Additional charges will apply for the extended duration.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-200">
              <button
                onClick={closeTermsModal}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {notification.open && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`${
              notification.severity === "success"
                ? "bg-green-100 border-green-400 text-green-700"
                : "bg-red-100 border-red-400 text-red-700"
            } px-4 py-3 rounded border relative`}
          >
            <span className="absolute top-0 right-0 px-2 py-1 cursor-pointer" onClick={handleCloseNotification}>
              &times;
            </span>
            <p>{notification.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetailPage;