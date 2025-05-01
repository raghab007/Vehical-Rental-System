import React from "react";
import Footer from "../components/Footer";

const blogPosts = [
  {
    id: 1,
    title: "Top 5 Road Trips to Take with a Rental Car",
    image: "https://whatthenepal.com/wp-content/uploads/2023/05/MUSEUM-22.jpg",
    description:
      "Discover the most scenic routes and hidden gems you can explore with our rental cars.",
    link: "/road-trips",
  },
  {
    id: 2,
    title: "How to Choose the Right Car for Your Journey",
    image: "https://cdn.vectorstock.com/i/500p/55/61/why-choose-us-speech-bubble-vector-24175561.jpg",
    description:
      "Learn how to pick the perfect car for your trip based on comfort, budget, and more.",
    link: "/choose-car",
  },
  {
    id: 3,
    title: "Essential Tips for First-Time Renters",
    image: "https://www.nepalpowerplaces.com/wp-content/uploads/2019/02/Swayambhunath_Stupa.jpg",
    description:
      "A beginner's guide to renting a car, including insurance, mileage, and terms.",
    link: "/renting-tips",
  },
];

export default function BlogPage() {
  return (
    <div className="mt-32 py-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">
          Our Blog
        </h1>
        <p className="text-lg text-center mb-12 text-gray-600">
          Stay updated with the latest tips, trends, and guides for your car rental experience.
        </p>
      </div>

      {/* Blog Cards */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="flex flex-col">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg h-full flex flex-col">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6 flex-grow">
                  <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                  <p className="text-gray-600 line-clamp-3 mb-4">
                    {post.description}
                  </p>
                </div>
                <a
                  href={post.link}
                  className="mx-4 mb-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 text-center"
                >
                  Read More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* <Footer/> */}

    </div>
  );
}