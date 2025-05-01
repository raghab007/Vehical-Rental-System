import React, { useState } from "react";
import axios from "axios";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  if(localStorage.getItem("token")){
    window.location.href = "/"
  }

  async function handleLogin(e) {
    e.preventDefault();
    const user = {
      email: email,
      password: password
    }

    try {
      const response = await axios.post("http://localhost:4000/login", user, {
        headers: {
          "Content-type": "application/json"
        }
      });

      const token = response.data.token;
      const role = response.data.role
      if(token) {
        alert("Login successful");
        localStorage.setItem("token", token);
        // This is for the user role for the frontend
        if(role=="USER"){
          window.location.href = "/"

       // This is for the admin role for the frontend
        }else if(role=="ADMIN"){
          window.location.href = "/admin"
        }
      } else {
        alert("Invalid credentials");
      }
    } catch(error) {
      alert("Server error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-r from-blue-50 to-indigo-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
        <div className="absolute inset-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-blue-200/30 to-indigo-200/30"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                animation: `float ${Math.random() * 10 + 20}s infinite ease-in-out`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl relative z-10 overflow-hidden border border-gray-100">
        {/* Top Colored Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-400"></div>
        
        <div className="px-8 pt-12 pb-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="h-20 w-20 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-blue-200">
              <Lock className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-500">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 group-hover:border-gray-300"
                />
                <div className="absolute left-0 top-0 h-full w-12 flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors duration-200">
                  <Mail size={20} />
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <a 
                  href="/forgot-password" 
                  className="text-xs text-blue-500 hover:text-blue-700 hover:underline transition-colors"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 group-hover:border-gray-300"
                />
                <div className="absolute left-0 top-0 h-full w-12 flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors duration-200">
                  <Lock size={20} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 rounded-xl hover:shadow-lg transition-all duration-300 font-medium mt-4"
            >
              Sign In
            </button>

          

           
          </form>

          {/* Signup Link */}
          <div className="text-center mt-8">
            <p className="text-gray-500">
              Don't have an account?{" "}
              <a 
                href="/signup" 
                className="text-blue-500 font-semibold hover:text-blue-700 transition-colors"
              >
                Create an account
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;