import React, { useState } from 'react';
import { Outlet, Link, useLocation } from "react-router-dom";
import { FaUsers, FaCar, FaCog, FaTachometerAlt, FaHistory, FaSignOutAlt, FaClock, FaBars } from "react-icons/fa";

function Admin() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 p-4 shadow-sm flex items-center justify-between">
                    <div className="flex items-center">
                        <button 
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="mr-4 text-gray-600 hover:text-gray-900 focus:outline-none lg:hidden"
                        >
                            <FaBars size={20} />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                                AD
                            </div>
                        </div>
                    </div>
                </header>
                
                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

function Sidebar({ isOpen, toggleSidebar }) {
    const location = useLocation();
    
    const menuItems = [
        {
            path: "/admin",
            icon: <FaTachometerAlt />,
            label: "Dashboard"
        },
        {
            path: "/admin/customers",
            icon: <FaUsers />,
            label: "Customers"
        },
        {
            path: "/admin/vehicles",
            icon: <FaCar />,
            label: "Vehicles"
        },
        {
            path: "/admin/extensions",
            icon: <FaClock />,
            label: "Extension Requests"
        },
       
        {
            path: "/admin/rentals",
            icon: <FaCar/>,
            label: "Rental History"
        },
       
    ];
    
    function logout() {
        localStorage.removeItem("token");
        window.location.href = "/";
    }
    
    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
            
            {/* Sidebar */}
            <div className={`
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto
            `}>
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="flex items-center justify-center h-20 bg-blue-600 text-white">
                        <div className="text-xl font-bold tracking-wide">CarRental Admin</div>
                    </div>
                    
                    {/* Navigation */}
                    <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                                    ${location.pathname === item.path
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100'}
                                `}
                            >
                                <span className={`mr-3 text-lg ${location.pathname === item.path ? 'text-blue-600' : 'text-gray-500'}`}>
                                    {item.icon}
                                </span>
                                {item.label}
                                {location.pathname === item.path && (
                                    <span className="ml-auto w-1.5 h-6 rounded-full bg-blue-600"></span>
                                )}
                            </Link>
                        ))}
                    </nav>
                    
                    {/* User profile */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="flex items-center mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-3">
                                AD
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">Admin User</div>
                                <div className="text-sm text-gray-500">admin@example.com</div>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="
                                w-full flex items-center justify-center
                                bg-red-500 hover:bg-red-600
                                text-white py-2 rounded-lg
                                transition-colors duration-200
                            "
                        >
                            <FaSignOutAlt className="mr-2" /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Admin;