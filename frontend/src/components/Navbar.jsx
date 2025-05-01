import React from "react";
import { NavLink } from "react-router-dom";
import { useRecoilState } from "recoil";
import { isLogin } from "../store/atoms";

function Navbar() {
  const [state] = useRecoilState(isLogin);

  return (
    <nav className="bg-white text-black shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-800">JOURNEY WHEELS</h1>
          </div>

          {/* Navigation Links Section (Centered) */}
          <div className="hidden md:flex items-center justify-center flex-grow space-x-10">
            <NavLink
              to="/"
              className={({ isActive }) => 
                `text-lg font-bold no-underline transition-all duration-300 ${
                  isActive 
                    ? "text-blue-800 border-b-2 border-blue-800" 
                    : "text-black hover:text-blue-800"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/vehicle"
              className={({ isActive }) => 
                `text-lg font-bold no-underline transition-all duration-300 ${
                  isActive 
                    ? "text-blue-800 border-b-2 border-blue-800" 
                    : "text-black hover:text-blue-800"
                }`
              }
            >
              Vehicle
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) => 
                `text-lg font-bold no-underline transition-all duration-300 ${
                  isActive 
                    ? "text-blue-800 border-b-2 border-blue-800" 
                    : "text-black hover:text-blue-800"
                }`
              }
            >
              Blog
            </NavLink>
            <NavLink
              to="/aboutus"
              className={({ isActive }) => 
                `text-lg font-bold no-underline transition-all duration-300 ${
                  isActive 
                    ? "text-blue-800 border-b-2 border-blue-800" 
                    : "text-black hover:text-blue-800"
                }`
              }
            >
              About Us
            </NavLink>
            <NavLink
              to="/contactus"
              className={({ isActive }) => 
                `text-lg font-bold no-underline transition-all duration-300 ${
                  isActive 
                    ? "text-blue-800 border-b-2 border-blue-800" 
                    : "text-black hover:text-blue-800"
                }`
              }
            >
              Contact Us
            </NavLink>


            <NavLink
              to="/information"
              className={({ isActive }) => 
                `text-lg font-bold no-underline transition-all duration-300 ${
                  isActive 
                    ? "text-blue-800 border-b-2 border-blue-800" 
                    : "text-black hover:text-blue-800"
                }`
              }
            >
              Information
            </NavLink>
          </div>

          {/* Buttons (Login and Sign Up) */}
          <div className="flex space-x-4">
            {state ? (
              <NavLink
                to="/profile"
                className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300"
              >
                User Profile
              </NavLink>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="border border-blue-800 text-blue-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors duration-300"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;