import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mountain, Shield, Users, ChevronRight } from 'lucide-react';

const OffRoadingNepal = () => {
  const [activeVideo, setActiveVideo] = useState(1);
  const routesRef = useRef(null);
  const navigate = useNavigate();

  const scrollToRoutes = () => {
    routesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const navigateToVehiclePage = () => {
    navigate('/vehicle');
  };

  const videos = [
    {
      id: 1,
      title: "Tips for the Off-Road",
      embedUrl: "https://www.youtube.com/embed/PhMx-J-_CBM?start=25&rel=0",
      description: "Essential off-road driving techniques and vehicle handling tips for Nepal's rugged terrain."
    },
    {
      id: 2,
      title: "Drive Uphill Safely",
      embedUrl: "https://www.youtube.com/embed/DrS4_kGaxlE?rel=0",
      description: "Learn proper gear usage, traction control, and climbing techniques for Nepal's steep mountain roads."
    },
    {
      id: 3,
      title: "Safely Drive on Highways",
      embedUrl: "https://www.youtube.com/embed/DH7sLbuflRU?rel=0&modestbranding=1",
      description: "Navigate Nepal's busy highways with confidence using these defensive driving strategies."
    },
    {
      id: 4,
      title: "Drive in Night Time",
      embedUrl: "https://www.youtube.com/embed/wsE6EjC0EIc?rel=0",
      description: "Night driving safety tips including proper lighting use and hazard awareness for Nepal's roads."
    },
    {
      id: 5,
      title: "Change the Tyre",
      embedUrl: "https://www.youtube.com/embed/6BZ-6HbjD0w?rel=0&modestbranding=1",
      description: "Step-by-step guide to safely changing tyres in remote locations with limited tools."
    }
  ];

  const features = [
    {
      icon: <Mountain className="h-8 w-8" />,
      title: "High-Performance 4x4s",
      description: "Our vehicles are specially equipped for Nepal's challenging terrain with reinforced suspension and all-terrain tires."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Safety First",
      description: "All vehicles come with safety equipment, GPS tracking, and 24/7 emergency support."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Local Guides",
      description: "Optional expert guides who know every trail, hidden gem, and local custom."
    }
  ];

  const destinations = [
    { 
      name: "Mustang Valley", 
      image: "https://st4.depositphotos.com/1734628/21212/i/1600/depositphotos_212120906-stock-photo-road-travel-extreme-mountain-road.jpg", 
      difficulty: "Advanced",
      description: "Experience the rugged beauty of Upper Mustang with challenging river crossings and high-altitude trails."
    },
    { 
      name: "Kalinchowk Track", 
      image: "https://www.lifedreamadventure.com/rental/pagegallery/kathmandu-to-kalinchok-by-jeep74.jpg", 
      difficulty: "Moderate",
      description: "Scenic route through lush forests leading to the sacred Kalinchowk Bhagwati temple."
    },
    { 
      name: "Everest Region", 
      image: "https://www.discoveraltitude.com/uploads/package/luxury-muktinath-jeep-tour.webp", 
      difficulty: "Expert",
      description: "High-altitude adventure through the world's highest mountain range with breathtaking views."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative">
        <div className="bg-indigo-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-12">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                  Conquer Nepal's Wilderness
                </h1>
                <p className="text-xl text-indigo-100 mb-8">
                  Experience the thrill of off-roading through Nepal's breathtaking landscapes with our premium 4x4 vehicles and expert guidance.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={navigateToVehiclePage}
                    className="bg-white text-indigo-900 font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-100 transition duration-300"
                  >
                    Book Now
                  </button>
                  <button 
                    onClick={scrollToRoutes}
                    className="bg-transparent border-2 border-white text-white font-bold px-6 py-3 rounded-lg hover:bg-white hover:text-indigo-900 transition duration-300"
                  >
                    Explore Routes
                  </button>
                </div>
              </div>
              <div className="md:w-1/2 mt-12 md:mt-0">
                {/* Placeholder for hero image or video */}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Featured Video Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Essential Off-Road Tips</h2>
          <p className="mt-4 text-xl text-gray-600">Watch and learn from our expert guides</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl overflow-hidden shadow-xl">
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                className="w-full h-96"
                src={videos[activeVideo-1].embedUrl}
                title={videos[activeVideo-1].title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{videos[activeVideo-1].title}</h3>
              <p className="text-gray-600 text-lg">{videos[activeVideo-1].description}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 bg-indigo-800 text-white">
              <h3 className="text-xl font-bold">Video Library</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {videos.map((video) => (
                <button
                  key={video.id}
                  className={`w-full text-left p-4 hover:bg-indigo-50 transition duration-200 flex items-center ${activeVideo === video.id ? 'bg-indigo-100' : ''}`}
                  onClick={() => setActiveVideo(video.id)}
                >
                  <div className="mr-4 flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    {video.id}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{video.title}</h4>
                    <p className="text-sm text-gray-500 line-clamp-1">{video.description}</p>
                  </div>
                  <ChevronRight className={`ml-auto ${activeVideo === video.id ? 'text-indigo-600' : 'text-gray-400'}`} size={20} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Why Choose Our Off-Road Experience</h2>
            <p className="mt-4 text-xl text-indigo-200">Premium vehicles and services to ensure your adventure is safe and unforgettable</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-indigo-800 rounded-xl p-8 shadow-lg transform hover:scale-105 transition duration-300">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-100 text-indigo-900 rounded-lg mb-6">
                  {React.cloneElement(feature.icon, { className: "h-8 w-8" })}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-indigo-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations - This is the section we'll scroll to */}
      <section ref={routesRef} className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Popular Off-Road Routes</h2>
          <p className="mt-4 text-xl text-gray-600">Discover Nepal's most thrilling terrains</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <div key={index} className="group relative overflow-hidden rounded-xl shadow-lg">
              <img 
                src={destination.image} 
                alt={destination.name} 
                className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-full mb-2">
                  {destination.difficulty}
                </span>
                <h3 className="text-2xl font-bold text-white">{destination.name}</h3>
                <p className="text-white mt-2">{destination.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready for Your Off-Road Adventure?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Book your premium 4x4 vehicle today and start exploring Nepal's breathtaking landscapes with confidence.
          </p>
          <button 
            onClick={navigateToVehiclePage}
            className="bg-white text-indigo-900 font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-indigo-100 transition duration-300"
          >
            Book Your Adventure
          </button>
        </div>
      </section>
    </div>
  );
};

export default OffRoadingNepal;
