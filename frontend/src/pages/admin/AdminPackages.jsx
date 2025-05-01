import { useState, useEffect } from "react";
import axios from "axios";
import PackageForm from "./PackageForm";
import { Edit, Trash2, Plus } from "lucide-react";

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingPackage, setEditingPackage] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:4000/packages");
      console.log(response.data[0].imageUrl)
      setPackages(response.data);
    } catch (err) {
      setError("Failed to fetch packages");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    
    try {
      await axios.delete(`http://localhost:4000/packages/${id}`);
      fetchPackages();
    } catch (err) {
      setError("Failed to delete package");
      console.error(err);
    }
  };

  const handleSuccess = () => {
    fetchPackages();
    setEditingPackage(null);
    setShowForm(false);
  };

  if (isLoading) return <div>Loading packages...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Adventure Packages</h1>
        <button
          onClick={() => {
            setEditingPackage(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={16} />
          Add New Package
        </button>
      </div>

      {showForm || editingPackage ? (
        <PackageForm
          packageData={editingPackage}
          onSuccess={handleSuccess}
          onCancel={() => {
            setEditingPackage(null);
            setShowForm(false);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="border rounded-lg overflow-hidden shadow">
              <div className="h-48 bg-gray-100 relative">
                {pkg.imageUrl && (
                  <img
                    src={`http://localhost:4000${pkg.imageUrl}`}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => setEditingPackage(pkg)}
                    className="bg-blue-500 text-white p-1 rounded"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="bg-red-500 text-white p-1 rounded"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">{pkg.title}</h3>
                <p className="text-gray-600">{pkg.duration}</p>
                <p className="text-gray-600">{pkg.vehicleType}</p>
                <p className="font-bold text-blue-600 mt-2">{pkg.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}