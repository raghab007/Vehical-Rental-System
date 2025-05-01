import React from 'react';

const AboutUs = () => {
  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">About VehicleRent</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Your trusted partner on the road since 2010</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">Our Mission</h3>
            <p className="text-gray-700 mb-4">
              At VehicleRent, we're committed to providing exceptional rental experiences through quality vehicles, transparent pricing, and unmatched customer service. 
              We believe transportation should be accessible, reliable, and tailored to your unique journey.
            </p>
            <div className="flex items-center mt-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-blue-700 font-medium">Making mobility simple and accessible for everyone</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">Why Choose Us</h3>
            <ul className="space-y-3">
              {[
                "Diverse fleet of well-maintained vehicles",
                "Flexible rental options - hourly, daily, weekly, or monthly",
                "Transparent pricing with no hidden fees",
                "24/7 roadside assistance for peace of mind",
                "Convenient pickup and drop-off locations",
                "Digital booking system for hassle-free reservations"
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-blue-700 mb-6 text-center">Our Journey</h3>
          <div className="relative">
            {/* Timeline */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>
            
            {/* Timeline items */}
            <div className="space-y-12">
              {[
                {
                  year: "2010",
                  title: "Humble Beginnings",
                  description: "Started with a fleet of just 5 cars serving our local community with a commitment to quality service."
                },
                {
                  year: "2015",
                  title: "Expansion Phase",
                  description: "Expanded our fleet to include motorcycles, trucks, and luxury vehicles, opening 3 new locations across the region."
                },
                {
                  year: "2020",
                  title: "Digital Transformation",
                  description: "Launched our mobile app and online booking platform, making vehicle rentals more accessible and convenient."
                },
                {
                  year: "2023",
                  title: "Sustainability Initiative",
                  description: "Introduced electric and hybrid vehicles to our fleet, reducing our carbon footprint and promoting eco-friendly transportation."
                }
              ].map((item, index) => (
                <div key={index} className={`flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}>
                  <div className="w-full md:w-1/2 p-4">
                    <div className={`p-5 rounded-lg shadow-md bg-white ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                      <div className="font-bold text-blue-700 text-lg mb-2">{item.title}</div>
                      <p className="text-gray-700">{item.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold border-4 border-white shadow absolute left-1/2 transform -translate-x-1/2">
                    {item.year}
                  </div>
                  <div className="md:hidden text-blue-700 font-bold text-xl mb-2">{item.year}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md mb-16">
          <h3 className="text-2xl font-semibold text-blue-700 mb-6 text-center">Our Values</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Reliability",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                description: "We deliver on our promises, providing well-maintained vehicles and dependable service you can count on."
              },
              {
                title: "Transparency",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ),
                description: "Clear pricing, straightforward policies, and honest communication form the foundation of our business."
              },
              {
                title: "Customer Focus",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                ),
                description: "Your satisfaction drives our business. We go above and beyond to create exceptional rental experiences."
              }
            ].map((value, index) => (
              <div key={index} className="text-center p-4">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h4 className="text-lg font-semibold text-blue-700 mb-2">{value.title}</h4>
                <p className="text-gray-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Leadership Team Section with Blue Border */}
        <div className="bg-white text-blue-700 p-8 rounded-lg shadow-md border-2 border-blue-600 mb-16">
          <h3 className="text-2xl font-semibold mb-6 text-center">Meet Our Leadership Team</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Alex Johnson",
                position: "Founder & CEO",
                bio: "With over 15 years in the transportation industry, Alex brings vision and leadership to our operations."
              },
              {
                name: "Sarah Martinez",
                position: "Operations Director",
                bio: "Sarah ensures our fleet is maintained to the highest standards and our services run smoothly."
              },
              {
                name: "Michael Wong",
                position: "Customer Experience Manager",
                bio: "Michael is dedicated to creating seamless rental experiences and exceptional customer satisfaction."
              }
            ].map((person, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 bg-blue-800 rounded-full mx-auto mb-4 flex items-center justify-center text-white">
                  <span className="text-2xl font-bold">{person.name.charAt(0)}</span>
                </div>
                <h4 className="text-lg font-semibold mb-1">{person.name}</h4>
                <p className="text-blue-500 mb-2">{person.position}</p>
                <p className="text-gray-700 text-sm">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105">
            Join Our Journey
          </button>
          <p className="text-gray-600 mt-4">
            Ready to experience the difference? Visit one of our locations or book online today.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;