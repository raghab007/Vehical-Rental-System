import { Info, MapPin, Users, Briefcase, Fuel, ThumbsUp, AlertTriangle } from 'lucide-react';

export default function CarSelectionGuide() {
  const carTypes = [
    {
      type: "Compact Car",
      image: "/api/placeholder/300/200",
      description: "Small, fuel-efficient vehicles perfect for city driving and short trips.",
      bestFor: ["Solo travelers", "Couples", "City exploration", "Short distances", "Budget-conscious travelers"],
      examples: "Honda Fit, Toyota Yaris, Suzuki Swift"
    },
    {
      type: "Sedan",
      image: "/api/placeholder/300/200",
      description: "Balanced comfort and economy with more trunk space than compact cars.",
      bestFor: ["Small families", "Business travelers", "Longer journeys", "Highway driving", "Comfort-oriented travelers"],
      examples: "Toyota Corolla, Honda Civic, Hyundai Elantra"
    },
    {
      type: "SUV",
      image: "/api/placeholder/300/200",
      description: "Higher ground clearance and more spacious interiors for versatile travel needs.",
      bestFor: ["Families", "Group travels", "Light off-road", "Scenic routes", "Extra luggage"],
      examples: "Toyota RAV4, Honda CR-V, Hyundai Tucson"
    },
    {
      type: "4×4/Jeep",
      image: "/api/placeholder/300/200",
      description: "Rugged vehicles designed for off-road capabilities and challenging terrain.",
      bestFor: ["Adventure seekers", "Mountain roads", "Remote areas", "Off-road exploration", "Bad weather conditions"],
      examples: "Jeep Wrangler, Toyota Land Cruiser, Ford Bronco"
    },
    {
      type: "Minivan",
      image: "/api/placeholder/300/200",
      description: "Spacious vehicles with flexible seating for larger groups or families.",
      bestFor: ["Large families", "Extended group travel", "Road trips", "Lots of luggage", "Comfort for all passengers"],
      examples: "Toyota Sienna, Honda Odyssey, Kia Carnival"
    },
    {
      type: "Luxury Car",
      image: "/api/placeholder/300/200",
      description: "Premium vehicles offering superior comfort, features, and performance.",
      bestFor: ["Special occasions", "Business meetings", "Comfort priority", "Premium experience", "Making an impression"],
      examples: "Mercedes E-Class, BMW 5 Series, Audi A6"
    }
  ];

  const factors = [
    {
      title: "Group Size",
      icon: <Users className="h-8 w-8 text-blue-500" />,
      description: "Consider how many passengers will be traveling. Compact cars work for 1-2 people, sedans for 3-4, and SUVs or minivans for larger groups.",
      tips: "Remember to account for comfort on longer journeys – a car that fits four people technically might not be comfortable for four adults on a long road trip."
    },
    {
      title: "Destination & Route",
      icon: <MapPin className="h-8 w-8 text-blue-500" />,
      description: "Consider the terrain and road conditions at your destination. Urban destinations with good roads are suitable for any vehicle, while remote areas may require 4×4 capabilities.",
      tips: "Research your route beforehand – some scenic mountain or rural routes might have unpaved sections that standard vehicles might struggle with."
    },
    {
      title: "Luggage Requirements",
      icon: <Briefcase className="h-8 w-8 text-blue-500" />,
      description: "Assess how much luggage space you'll need. Compact cars have limited trunk space, while SUVs and minivans offer significantly more room for bags and equipment.",
      tips: "Consider not just the number of bags but also any special equipment like sports gear, baby strollers, or camping supplies."
    },
    {
      title: "Fuel Efficiency",
      icon: <Fuel className="h-8 w-8 text-blue-500" />,
      description: "For budget-conscious travelers or those covering long distances, fuel efficiency can significantly impact your overall travel costs.",
      tips: "Compact cars and hybrids typically offer the best fuel economy, while SUVs and luxury vehicles tend to consume more fuel."
    }
  ];

  const tips = [
    {
      title: "Book Early",
      description: "Reserve your vehicle well in advance, especially during peak travel seasons, to ensure you get your preferred car type."
    },
    {
      title: "Consider All Costs",
      description: "Factor in not just the rental rate but also fuel costs, insurance, parking fees, and any additional driver charges."
    },
    {
      title: "Check Reviews",
      description: "Research the specific vehicle models available and read reviews about their performance, comfort, and reliability."
    },
    {
      title: "Inspect Before Driving",
      description: "Always thoroughly inspect the vehicle and document any existing damage before driving off the rental lot."
    },
    {
      title: "Understand Local Driving Conditions",
      description: "Research local driving customs, road conditions, and any specific challenges you might face in your destination."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-blue-700 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">How to Choose the Right Car for Your Journey</h1>
          <p className="text-xl max-w-3xl mx-auto">Finding the perfect vehicle makes all the difference between a stressful trip and a memorable adventure.</p>
        </div>
      </header>

      {/* Introduction */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img src="https://miro.medium.com/v2/resize:fit:728/1*Oi2Bm_5nXD2t66yoIL19aw.jpeg" alt="Car selection" className="rounded-lg shadow-lg" />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">The Right Vehicle Makes All the Difference</h2>
              <p className="text-gray-700 mb-4">
                Selecting the right rental car is about more than just price and availability. The perfect vehicle 
                for your journey should match your destination's terrain, accommodate your group size and luggage, 
                and fit your budget and preferences.
              </p>
              <p className="text-gray-700 mb-4">
                Whether you're navigating city streets, cruising coastal highways, or venturing into mountain terrain, 
                your choice of vehicle will significantly impact your travel experience.
              </p>
              <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
                <div className="flex items-start">
                  <Info className="text-blue-500 mr-2 mt-1 flex-shrink-0" />
                  <p className="text-blue-800">
                    At Journey Wheels, we offer a diverse fleet of vehicles to match every type of adventure, 
                    from compact city cars to rugged 4×4s for off-road exploration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Factors to Consider */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Key Factors to Consider</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {factors.map((factor, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center mb-4">
                  {factor.icon}
                  <h3 className="text-xl font-bold ml-3 text-gray-800">{factor.title}</h3>
                </div>
                <p className="text-gray-700 mb-4">{factor.description}</p>
                <div className="bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400">
                  <div className="flex">
                    <ThumbsUp className="text-yellow-600 mr-2 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">{factor.tips}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

     

      {/* Special Considerations */}
      <section className="py-12 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Special Journey Considerations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Mountain & Hill Destinations</h3>
              <p className="text-gray-700 mb-4">
                For mountainous regions like Swayambhunath or destinations with steep inclines, consider vehicles with:
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2"></div>
                  <span className="text-gray-700">Higher ground clearance to navigate uneven terrain</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2"></div>
                  <span className="text-gray-700">Good torque for uphill performance</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2"></div>
                  <span className="text-gray-700">Reliable braking systems for steep descents</span>
                </li>
              </ul>
              <div className="bg-yellow-50 p-4 rounded-md flex items-start">
                <AlertTriangle className="text-yellow-600 mr-2 flex-shrink-0" />
                <p className="text-sm text-yellow-800">
                  For destinations like Swayambhunath, even though roads are paved, a vehicle with decent power 
                  will make the journey more comfortable, especially when fully loaded with passengers.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Cultural & Religious Sites</h3>
              <p className="text-gray-700 mb-4">
                When visiting cultural sites like Swayambhunath Temple, consider:
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2"></div>
                  <span className="text-gray-700">Parking availability (often limited near popular sites)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2"></div>
                  <span className="text-gray-700">Vehicle size (smaller vehicles may be easier to park)</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 mt-2"></div>
                  <span className="text-gray-700">Security features if leaving valuables in the car</span>
                </li>
              </ul>
              <div className="bg-blue-50 p-4 rounded-md flex items-start">
                <Info className="text-blue-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  For Swayambhunath visits, consider that you'll need to park at the base and climb many 
                  steps to reach the temple complex. Choose a vehicle comfortable for the drive but be 
                  prepared for walking the final portion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tips for Booking */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Tips for Booking the Perfect Vehicle</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-3 text-blue-700">{tip.title}</h3>
                <p className="text-gray-700">{tip.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 bg-blue-600 text-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Need Expert Advice?</h3>
            <p className="mb-6">
              Our team at Journey Wheels has extensive experience with all routes and destinations in the region. 
              We're happy to recommend the perfect vehicle based on your specific itinerary.
            </p>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-md font-bold hover:bg-blue-50 transition">
              Contact Our Experts
            </button>
          </div>
        </div>
      </section>

      {/* Conclusion */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Journey, Your Choice</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The perfect vehicle enhances your travel experience, providing comfort, convenience, and capability 
            for your specific journey needs. At Journey Wheels, we're committed to matching you with the 
            ideal car for an unforgettable adventure.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
           
            
          </div>
        </div>
      </section>

      
      
    </div>
  );
}