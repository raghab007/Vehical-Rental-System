import { useState } from 'react';
import { Car, Compass, Map, Check, ChevronDown, ChevronUp } from 'lucide-react';

export default function JourneyWheelsPage() {
  const [openFaqs, setOpenFaqs] = useState({});
  
  const toggleFaq = (id) => {
    setOpenFaqs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const carOptions = [
    {
      id: 1,
      name: "Compact Hatchback",
      image: "https://www.carandbike.com/_next/image?url=https%3A%2F%2Fimages.carandbike.com%2Fcar-images%2Fbig%2Fhyundai%2Fsantro-xing%2Fhyundai-santro-xing.jpg%3Fv%3D5&w=640&q=75",
      description: "Perfect for solo travelers or couples visiting Swayambhunath. Economical and easy to navigate through narrow city streets.",
      features: ["Fuel-efficient", "Easy parking", "Nimble handling"],
      recommended: "Ideal for short city trips and solo travelers"
    },
    {
      id: 2,
      name: "Mid-size SUV",
      image: "https://capitalhyundai.co.in/wp-content/uploads/2023/03/Hyundai-Creta-1.webp",
      description: "Great balance of comfort and capability for visiting Swayambhunath. Handles mild terrain with ease.",
      features: ["Higher ground clearance", "Spacious interior", "Good visibility"],
      recommended: "Perfect for families and small groups"
    },
    {
      id: 3,
      name: "4x4 Jeep",
      image: "https://content.carlelo.com/uploads/model/mahindra-bolero-1.webp",
      description: "For adventure seekers wanting to explore beyond Swayambhunath. Handles rough roads with confidence.",
      features: ["All-terrain capability", "Rugged build", "Weather resistant"],
      recommended: "Best for adventurous travelers planning multiple destinations"
    }
  ];
  
  const faqs = [
    {
      id: 1,
      question: "How far is Swayambhunath from central Kathmandu?",
      answer: "Swayambhunath is approximately 3-4 kilometers from central Kathmandu, about a 15-20 minute drive depending on traffic conditions."
    },
    {
      id: 2,
      question: "Do I need a special vehicle to reach Swayambhunath?",
      answer: "No, a standard car is sufficient to reach Swayambhunath. The roads are paved, though they can be steep and winding in parts."
    },
    {
      id: 3,
      question: "Is parking available at Swayambhunath?",
      answer: "Yes, there is parking available near the eastern entrance of Swayambhunath. During peak tourist seasons, it may fill up quickly."
    },
    {
      id: 4,
      question: "What other destinations can I combine with Swayambhunath?",
      answer: "You can easily combine Swayambhunath with visits to Kathmandu Durbar Square, Thamel, Pashupatinath Temple, or Boudhanath Stupa in a single day's itinerary."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">You First Journey Begins</h1>
          <p className="text-xl mb-8">First Destination: Swayambhunath (Monkey Temple)</p>
          <div className="flex justify-center">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition">Book Now</button>
          </div>
        </div>
      </section>
      
      {/* Destination Info */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img 
                src="https://www.nepaltourhiking.com/wp-content/uploads/2024/03/Swayambhunath-Monastery-1.jpg" 
                alt="Swayambhunath Temple" 
                className="rounded-lg shadow-lg w-full h-auto max-h-[400px] object-contain"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Swayambhunath: The Monkey Temple</h2>
              <div className="flex items-center mb-4">
                <Map className="text-blue-600 mr-2" />
                <span className="text-gray-600">3-4 km from central Kathmandu</span>
              </div>
              <p className="text-gray-700 mb-4">
                Perched atop a hill west of Kathmandu, Swayambhunath is one of Nepal's most sacred Buddhist stupas. 
                Known as the "Monkey Temple" due to the holy monkeys that inhabit parts of the temple, it offers 
                panoramic views of the Kathmandu Valley.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-bold text-blue-800 flex items-center">
                  <Compass className="mr-2" />
                  Journey Tips:
                </h3>
                <ul className="ml-6 mt-2 text-gray-700 list-disc">
                  <li>Prepare for a steep climb of 365 steps</li>
                  <li>Early morning or late afternoon visits recommended</li>
                  <li>Parking available at the eastern entrance</li>
                  <li>Plan 2-3 hours for a complete visit</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Vehicle Options */}
      <section className="py-12 bg-gray-100" id="vehicles">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Recommended Vehicles</h2>
          <p className="text-center text-gray-600 mb-8">Select the perfect car for your Swayambhunath adventure</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {carOptions.map(car => (
              <div key={car.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                <img 
                  src={car.image} 
                  alt={car.name} 
                  className="w-full h-40 object-contain p-2 bg-gray-50"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2 text-gray-800">{car.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{car.description}</p>
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Features:</h4>
                    <ul className="space-y-1 text-sm">
                      {car.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-2 rounded text-sm">
                    <p className="text-blue-800 font-medium">{car.recommended}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto divide-y divide-gray-200">
            {faqs.map(faq => (
              <div key={faq.id} className="py-5">
                <button 
                  className="flex w-full text-left justify-between items-start"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                  {openFaqs[faq.id] ? <ChevronUp className="flex-shrink-0 text-gray-500" /> : <ChevronDown className="flex-shrink-0 text-gray-500" />}
                </button>
                {openFaqs[faq.id] && (
                  <div className="mt-2 pr-12">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for Your Swayambhunath Adventure?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Book your ideal vehicle today and enjoy a comfortable journey to one of Nepal's most iconic landmarks.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition">
              View All Vehicles
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}