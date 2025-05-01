import React from "react";

function Settings() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* General Settings */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">General Settings</h2>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input type="checkbox" defaultChecked className="form-checkbox h-5 w-5 text-blue-600" />
            <span>Enable Dark Mode</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
            <span>Enable Email Notifications</span>
          </label>
        </div>
      </div>

      {/* User Permissions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">User Permissions</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Role</label>
            <input
              type="text"
              defaultValue="Admin"
              disabled
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User Role</label>
            <input
              type="text"
              defaultValue="User"
              disabled
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input type="checkbox" defaultChecked className="form-checkbox h-5 w-5 text-blue-600" />
            <span>Enable Push Notifications</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" defaultChecked className="form-checkbox h-5 w-5 text-blue-600" />
            <span>Enable SMS Notifications</span>
          </label>
        </div>
      </div>

      {/* Save Button */}
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md">
        Save Changes
      </button>
    </div>
  );
}

export default Settings;