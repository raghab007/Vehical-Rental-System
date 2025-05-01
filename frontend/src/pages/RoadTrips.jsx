import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Car, Info, ChevronDown, ChevronUp } from 'lucide-react';

export default function NepalRoadTrips() {
  const [expandedTrip, setExpandedTrip] = useState(null);
  
  const toggleExpand = (index) => {
    if (expandedTrip === index) {
      setExpandedTrip(null);
    } else {
      setExpandedTrip(index);
    }
  };
  
  const roadTrips = [
    {
      title: "Kathmandu to Pokhara",
      image: "https://static2.tripoto.com/media/filter/tst/img/163969/TripDocument/1555827637_nepal_pokhara_wooden_boats_on_phewa_lake.jpg",
      distance: "200 km",
      duration: "6-7 hours",
      bestTime: "September to May",
      description: "The most popular road trip in Nepal connects the bustling capital to the serene lakeside city of Pokhara. The Prithvi Highway offers stunning views of terraced fields, river valleys, and glimpses of the Himalayan peaks in the distance.",
      highlights: [
        "Scenic views of Trishuli River",
        "Stops at Kurintar and Bandipur",
        "Mountain panoramas on clear days",
        "Well-maintained highway suitable for rental cars"
      ]
    },
    {
      title: "Kathmandu Valley Loop",
      image: "https://www.everesttreknepal.com/wp-content/uploads/2018/05/Clean-Kathmandu-during-the-COVID-19-lockdown-NT-4.jpg",
      distance: "60-80 km",
      duration: "1-2 days",
      bestTime: "Year-round (avoid monsoon season)",
      description: "Explore the ancient cities and cultural sites around Kathmandu Valley. This circular route connects Kathmandu, Bhaktapur, Patan, and various temple complexes on well-paved roads ideal for tourist drivers.",
      highlights: [
        "UNESCO World Heritage Sites",
        "Medieval Newari architecture",
        "Mountain views from Nagarkot",
        "Local crafts and cuisine"
      ]
    },
    {
      title: "Pokhara to Lumbini",
      image: "https://lumbinidevtrust.gov.np/upload_file/images/slider/1721894939_276597348_lumbini.jpg",
      distance: "280 km",
      duration: "8-9 hours",
      bestTime: "October to March",
      description: "Connect the tourist hub of Pokhara with Lumbini, the birthplace of Buddha. This journey on the Siddhartha Highway offers varied landscapes from mountains to the flat Terai region.",
      highlights: [
        "Spectacular views of Annapurna range",
        "Palpa's hilltop views and Tansen town",
        "Butwal's subtropical landscapes",
        "Buddhist pilgrimage sites in Lumbini"
      ]
    },
    {
      title: "Kathmandu to Nagarkot to Dhulikhel",
      image: "https://d2lwt6tidfiof0.cloudfront.net/images/background/bg-nepal.jpg",
      distance: "45 km",
      duration: "3-4 hours (with stops)",
      bestTime: "October to May",
      description: "A short but spectacular road trip from Kathmandu to two of the best mountain viewpoints near the capital. Perfect for travelers with limited time who want to experience dramatic Himalayan views.",
      highlights: [
        "Panoramic sunrise and sunset views",
        "Glimpses of Mt. Everest on clear days",
        "Traditional Newari villages",
        "Short driving distances on well-maintained roads"
      ]
    },
    {
      title: "Mugling to Chitwan",
      image: "https://www.go2trek.com/wp-content/uploads/2018/03/chitwan-tour-1-881x435.jpg",
      distance: "100 km",
      duration: "3-4 hours",
      bestTime: "October to March",
      description: "A southern journey from the Prithvi Highway junction at Mugling to Chitwan National Park. This route takes you from hills to plains on good roads, ending at Nepal's premier wildlife destination.",
      highlights: [
        "Transition from hills to Terai flatlands",
        "Narayanghat city",
        "Entry to Chitwan National Park",
        "River views and rural landscapes"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-900 mb-4">
            Top 5 Road Trips to Take with a Rental Car in Nepal
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Discover Nepal's beauty on these popular paved routes perfect for tourists. Experience breathtaking mountain views, cultural treasures, and natural wonders with comfort and convenience.
          </p>
        </header>

        <div className="space-y-8">
          {roadTrips.map((trip, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="md:flex">
                <div className="md:w-2/5">
                  <img 
                    src={trip.image} 
                    alt={trip.title} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-3/5">
                  <h2 className="text-2xl font-bold text-indigo-800 mb-3">
                    {trip.title}
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center text-slate-700">
                      <Car className="w-5 h-5 mr-2 text-indigo-600" />
                      <span>{trip.distance}</span>
                    </div>
                    <div className="flex items-center text-slate-700">
                      <Clock className="w-5 h-5 mr-2 text-indigo-600" />
                      <span>{trip.duration}</span>
                    </div>
                    <div className="flex items-center text-slate-700">
                      <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
                      <span>{trip.bestTime}</span>
                    </div>
                    <div className="flex items-center text-slate-700">
                      <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                      <span>Paved Roads</span>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 mb-4">
                    {trip.description}
                  </p>
                  
                  <button 
                    onClick={() => toggleExpand(index)}
                    className="flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                  >
                    {expandedTrip === index ? (
                      <>
                        <ChevronUp className="w-5 h-5 mr-1" />
                        Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-5 h-5 mr-1" />
                        Show highlights
                      </>
                    )}
                  </button>
                  
                  {expandedTrip === index && (
                    <div className="mt-4 bg-indigo-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-indigo-800 mb-2 flex items-center">
                        <Info className="w-5 h-5 mr-2" />
                        Highlights
                      </h3>
                      <ul className="list-disc pl-5 space-y-1 text-slate-700">
                        {trip.highlights.map((highlight, i) => (
                          <li key={i}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-indigo-100 p-6 rounded-xl">
          <h2 className="text-xl font-bold text-indigo-800 mb-3">Rental Car Tips for Nepal</h2>
          <ul className="space-y-2 text-slate-700">
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-2">•</span>
              Book vehicles with higher clearance for Nepal's varied road conditions
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-2">•</span>
              Consider hiring a local driver if you're not comfortable with local driving practices
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-2">•</span>
              Always carry extra water, snacks, and basic supplies
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-2">•</span>
              Check weather conditions before long journeys, especially during monsoon season
            </li>
            <li className="flex items-start">
              <span className="text-indigo-600 font-bold mr-2">•</span>
              Download offline maps as internet connectivity may be limited in some areas
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}