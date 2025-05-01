import React, { useState, useEffect } from "react";
import { Car, MapPin, Calendar, ArrowRight, Phone, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

export default function HomePage() {
  const [vehicles, setVehicles] = useState([]);
  const [packages, setPackages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPackagesLoading, setIsPackagesLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setIsPackagesLoading(true);
        
        // Fetch vehicles
        const vehiclesResponse = await fetch("http://localhost:4000/vehicle/get");
        if (!vehiclesResponse.ok) throw new Error("Failed to fetch vehicles");
        const vehiclesData = await vehiclesResponse.json();
        setVehicles(vehiclesData.slice(0, 6));

        // Fetch packages
        const packagesResponse = await fetch("http://localhost:4000/packages");
        if (!packagesResponse.ok) throw new Error("Failed to fetch packages");
        const packagesData = await packagesResponse.json();
        setPackages(packagesData.slice(0, 3)); // Get first 3 packages

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
        setIsPackagesLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-sliding functionality
  useEffect(() => {
    const autoSlideInterval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      clearInterval(autoSlideInterval);
    };
  }, [vehicles.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % vehicles.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + vehicles.length) % vehicles.length);
  };

  const getVisibleVehicles = () => {
    if (vehicles.length === 0) return [];
    
    const result = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % vehicles.length;
      result.push(vehicles[index]);
    }
    return result;
  };

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-12 md:mb-0 flex justify-center">
            <img
              src="https://imgd.aeplcdn.com/642x336/n/q4eko3a_1582595.jpg?q=80"
              alt="BMW Car"
              className="max-w-full h-auto object-contain"
            />
          </div>

          <div className="md:w-1/2 text-left md:pl-12">
            <h1 className="text-4xl font-bold mb-6 text-gray-900 leading-tight">
              "Your Journey Begins Here – Rent the Perfect Ride Today!"
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Choose from a range of premium and budget vehicles for your travel needs. Book now and
              enjoy hassle-free rides tailored to your journey.
            </p>
            <Link 
              to="/vehicle" 
              className="inline-flex items-center px-8 py-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors text-lg"
            >
              Book Now
              <ArrowRight className="ml-3" size={24} />
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Vehicles Slider Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Featured Vehicles</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Explore our top-rated vehicles available for rent
          </p>
          
          <div className="relative">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No vehicles available at the moment</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {getVisibleVehicles().map((vehicle) => (
                    <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                      <div className="h-64 bg-gray-100">
                        {vehicle.imageUrl ? (
                          <img
                            src={`http://localhost:4000/${vehicle.imageUrl}`}
                            alt={vehicle.vehicleName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/placeholder-vehicle.jpg';
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-100">
                            <Car size={80} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="text-2xl font-semibold mb-2">{vehicle.vehicleName}</h3>
                        <div className="flex justify-between text-sm mb-3">
                          <span className="text-gray-600">{vehicle.type}</span>
                          <span className="text-gray-600">{vehicle.model}</span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="font-medium text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {vehicle.fuelType}
                          </span>
                          <span className="font-bold text-lg text-blue-600">
                            Rs{vehicle.pricePerHour}/hour
                          </span>
                        </div>
                        <Link
                          to={`/vehicle`}
                          className="block text-center bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md transition-colors"
                        >
                          Book Now
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-6 bg-white rounded-full p-2 shadow-md text-gray-600 hover:text-blue-600 focus:outline-none z-10"
                  aria-label="Previous vehicle"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-6 bg-white rounded-full p-2 shadow-md text-gray-600 hover:text-blue-600 focus:outline-none z-10"
                  aria-label="Next vehicle"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
          
          <div className="text-center mt-10">
            <Link
              to="/vehicle"
              className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              View All Vehicles
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose Our Service</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-gray-200 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow bg-white">
              <div className="bg-blue-100 rounded-full p-4 inline-flex mb-4">
                <Car className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Quality Vehicles</h3>
              <p className="text-gray-600">Our fleet includes well-maintained cars for all your travel needs.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow bg-white">
              <div className="bg-blue-100 rounded-full p-4 inline-flex mb-4">
                <Calendar className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Easy Booking</h3>
              <p className="text-gray-600">Simple booking process with flexible scheduling options.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow bg-white">
              <div className="bg-blue-100 rounded-full p-4 inline-flex mb-4">
                <MapPin className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Nepal Coverage</h3>
              <p className="text-gray-600">Service available across major tourist destinations in Nepal.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Adventure Packages */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Our Adventure Packages</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Discover Nepal's breathtaking destinations with our curated travel packages
          </p>
          
          {isPackagesLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No packages available at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((packageItem) => (
                <div 
                  key={packageItem._id} 
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-56">
                    {packageItem.imageUrl ? (
                      <img 
                        src={`http://localhost:4000${packageItem.imageUrl}`}
                        alt={packageItem.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-package.jpg';
                        }}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100">
                        <MapPin size={80} className="text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <h3 className="absolute bottom-3 left-4 text-2xl font-bold text-white">{packageItem.title}</h3>
                  </div>
                  
                  <div className="p-6">
                    <div className="text-gray-700 mb-4 whitespace-pre-line">
                      {packageItem.description || "No description available"}
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <span className="text-xl font-bold text-blue-600">NPR: {packageItem.price}</span>
                      <Link 
                        to={`/packages/${packageItem._id}`}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                      >
                        Book Now
                        <ArrowRight className="ml-2" size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Customer Testimonials</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
              <p className="text-gray-700 mb-4">"The vehicle was in excellent condition and the staff was very helpful throughout our trip to Mustang. Highly recommend their service!"</p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="font-medium text-blue-600">RP</span>
                </div>
                <div className="ml-3">
                  <p className="font-medium">Niroj Panta</p>
                  <p className="text-sm text-gray-500">Kathmandu</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
              <p className="text-gray-700 mb-4">"The Pokhara package was perfect for our family vacation. Everything was well-organized and the driver was very knowledgeable."</p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="font-medium text-blue-600">SG</span>
                </div>
                <div className="ml-3">
                  <p className="font-medium">Dipesh Sigdel</p>
                  <p className="text-sm text-gray-500">Pokhara</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
              <p className="text-gray-700 mb-4">"Booking was easy and the customer service was excellent. The car was clean and fuel-efficient. Will use their service again!"</p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="font-medium text-blue-600">AT</span>
                </div>
                <div className="ml-3">
                  <p className="font-medium">Nikesh Thapa</p>
                  <p className="text-sm text-gray-500">Chitwan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 bg-blue-600">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg text-blue-100 mb-8">Book your vehicle now and explore Nepal with comfort and style.</p>
          <Link 
            to="/vehicle" 
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            View Available Vehicles
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>

      {/* Footer Section */}
    {/* <Footer></Footer> */}
    </div>
  );
}
