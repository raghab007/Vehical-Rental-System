import { useState, useRef } from "react";
import axios from "axios";
import { ArrowRight, X, Upload } from "lucide-react";

export default function PackageForm({ packageData, onSuccess, onCancel }) {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: packageData?.title || "",
    description: packageData?.description || "",
    duration: packageData?.duration || "",
    inclusions: packageData?.inclusions || "",
    vehicleType: packageData?.vehicleType || "",
    startPoint: packageData?.startPoint || "",
    price: packageData?.price || "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(packageData?.imageUrl || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("inclusions", formData.inclusions);
      formDataToSend.append("vehicleType", formData.vehicleType);
      formDataToSend.append("startPoint", formData.startPoint);
      formDataToSend.append("price", formData.price);
      
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      } else if (!packageData?.id && !previewUrl) {
        throw new Error("Image is required");
      }

      let response;
      if (packageData?.id) {
        // Update existing package
        response = await axios.put(
          `http://localhost:4000/packages/${packageData.id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Create new package
        response = await axios.post(
          "http://localhost:4000/packages",
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      onSuccess(response.data);
    } catch (err) {
      console.error("Error submitting package:", err);
      setError(err.response?.data?.error || err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">
        {packageData?.id ? "Edit Package" : "Add New Package"}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block font-medium">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Price *</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            placeholder="Npr: 16,000"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Duration *</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            placeholder="3 Night 4 days"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Vehicle Type *</label>
          <input
            type="text"
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            placeholder="Offroad"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Inclusions *</label>
          <textarea
            name="inclusions"
            value={formData.inclusions}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Fooding and lodging"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Start Point *</label>
          <input
            type="text"
            name="startPoint"
            value={formData.startPoint}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
            placeholder="Starts from Kathmandu"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium">
          {packageData?.id ? "Update Image" : "Package Image *"}
        </label>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
          id="package-image"
        />
        
        <div className="flex items-center gap-4">
          <label
            htmlFor="package-image"
            className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded flex items-center gap-2"
          >
            <Upload size={16} />
            {imageFile ? "Change Image" : "Choose Image"}
          </label>
          
          {previewUrl && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="text-red-500 flex items-center gap-1"
            >
              <X size={16} />
              Remove
            </button>
          )}
        </div>
        
        {previewUrl && (
          <div className="mt-2">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full h-48 object-cover rounded"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-100"
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
        
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            "Processing..."
          ) : (
            <>
              {packageData?.id ? "Update Package" : "Create Package"}
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}