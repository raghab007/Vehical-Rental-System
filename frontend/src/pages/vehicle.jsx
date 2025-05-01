import React, { useState, useEffect } from "react";
import { Search, Car, Filter } from "lucide-react";
import VehicleCard from "../components/VehicleCard";

const VehicleRental = () => {
  // State for vehicles and filters
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [priceFilter, setPriceFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Fetch vehicles from backend when component mounts
  useEffect(() => {
    async function fetchVehicles() {
      try {
        const response = await fetch("http://localhost:4000/vehicle/get");
        if (!response.ok) {
          throw new Error("Failed to fetch vehicles");
        }
        const data = await response.json();
        console.log(data);
        setVehicles(data);
        setFilteredVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    }
    fetchVehicles();
  }, []);

  // Filter vehicles based on price and category
  useEffect(() => {
    let result = [...vehicles];

    // Filter by price - updated to match the displayed price ranges
    if (priceFilter) {
      result = result.filter(vehicle => {
        if (!vehicle || vehicle.pricePerHour === undefined) return false;
        switch(priceFilter) {
          case 'low':
            return vehicle.pricePerHour < 1500;
          case 'medium':
            return vehicle.pricePerHour >= 1500 && vehicle.pricePerHour < 2000;
          case 'high':
            return vehicle.pricePerHour >= 2000;
          default:
            return true;
        }
      });
    }

    // Filter by category
    if (categoryFilter) {
      result = result.filter(vehicle => {
        if (!vehicle || !vehicle.type) return false;
        return vehicle.type.toLowerCase() === categoryFilter.toLowerCase();
      });
    }

    setFilteredVehicles(result);
  }, [priceFilter, categoryFilter, vehicles]);

  // Get unique categories for dropdown
  const categories = [...new Set(vehicles.map(vehicle => vehicle.type).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Car className="text-blue-600" size={40} />
            Choose Your Perfect Ride
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our diverse fleet of vehicles. From compact cars to luxury SUVs, we have the perfect vehicle for your journey.
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-center items-center">
          {/* Category Filter */}
          <div className="relative w-full max-w-md">
            <select 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
            <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>

          {/* Price Filter */}
          <div className="relative w-full max-w-md">
            <select 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            >
              <option value="">All Prices</option>
              <option value="low">Budget Friendly (Under Rs1500/hour)</option>
              <option value="medium">Mid-Range (Rs1500-Rs2000/hour)</option>
              <option value="high">Luxury (Rs2000+/hour)</option>
            </select>
            <Filter className="absolute left-3 top-3 text-gray-400" size={20} />
          </div>
        </div>

        {/* Vehicles Grid */}
        {filteredVehicles.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600">No vehicles found matching your filters.</p>
          </div>
        ) : (
          <div className="flex flex-wrap -mx-4">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleRental;