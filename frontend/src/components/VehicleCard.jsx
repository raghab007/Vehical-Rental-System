import React from "react";
import { Link } from "react-router-dom";
import { Car, Star, Clock, Zap } from "lucide-react";

export default function VehicleCard({ vehicle }) {
  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-3">
      <div className="h-full flex flex-col bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100">
        {/* Image with badge */}
        <div className="relative">
          <img
            src={`http://localhost:4000/uploads/${vehicle.imageUrl.split("\\")[1]}`}
            alt={vehicle.vehicleName}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
        </div>

        {/* Vehicle details */}
        <div className="p-4 flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{vehicle.vehicleName}</h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {vehicle.type || "Standard"}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {vehicle.description}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>Instant booking</span>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                Rs {vehicle.pricePerHour}
                <span className="text-sm font-normal text-gray-500">/hour</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="px-4 pb-4">
          <Link 
            to={`/cardetails/${vehicle.id}`} 
            className="block w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-center py-2 px-4 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}