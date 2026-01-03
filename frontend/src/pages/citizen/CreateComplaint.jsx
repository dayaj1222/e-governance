import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { complaintAPI, uploadAPI } from "../../utils/api";
import { toast } from "react-toastify";
import APP_CONFIG from "../../config/app.config";
import Select from "react-select";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin, Upload, X, Loader, Navigation } from "lucide-react";

// Fix Leaflet default marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to recenter map when location changes
function RecenterMap({ center }) {
  const map = useMap();
  if (center) {
    map.setView([center.lat, center.lng], APP_CONFIG.map.defaultZoom);
  }
  return null;
}

// Component to handle map clicks
function LocationMarker({ position, setPosition }) {
  const map = useMap();

  // Set up map click handler
  map.on("click", (e) => {
    setPosition({
      lat: e.latlng.lat,
      lng: e.latlng.lng,
    });
  });

  return position ? <Marker position={[position.lat, position.lng]} /> : null;
}

const CreateComplaint = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    urgency: "medium",
    city: "",
  });
  const [location, setLocation] = useState(null);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      padding: "0.5rem",
      borderColor:
        errors.category || errors.city
          ? "#EF4444"
          : state.isFocused
            ? APP_CONFIG.colors.primary
            : "#D1D5DB",
      boxShadow: state.isFocused
        ? `0 0 0 3px ${APP_CONFIG.colors.primary}15`
        : "none",
      "&:hover": {
        borderColor: state.isFocused ? APP_CONFIG.colors.primary : "#9CA3AF",
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? APP_CONFIG.colors.primary
        : state.isFocused
          ? `${APP_CONFIG.colors.primary}15`
          : "white",
      color: state.isSelected ? "white" : "#111827",
      cursor: "pointer",
    }),
  };

  const categoryOptions = APP_CONFIG.categories.map((cat) => ({
    value: cat.value,
    label: cat.label,
  }));

  const cityOptions = APP_CONFIG.cities.map((city) => ({
    value: city,
    label: city,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      toast.info("Getting your location...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLocation);
          if (errors.location) {
            setErrors({ ...errors, location: "" });
          }
          toast.success("Location captured!");
        },
        (error) => {
          console.error("Error getting location:", error);
          let errorMessage = "Could not get your location. ";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Please allow location access in your browser.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "Location request timed out.";
              break;
            default:
              errorMessage += "Please select location on map.";
          }

          toast.error(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > APP_CONFIG.upload.maxFiles) {
      toast.error(`Maximum ${APP_CONFIG.upload.maxFiles} images allowed`);
      return;
    }

    // Validate file size and type
    const validFiles = files.filter((file) => {
      if (file.size > APP_CONFIG.upload.maxSizePerFile) {
        toast.error(`${file.name} is too large. Max 5MB per file.`);
        return false;
      }
      if (!APP_CONFIG.upload.acceptedFormats.includes(file.type)) {
        toast.error(`${file.name} has invalid format.`);
        return false;
      }
      return true;
    });

    setImages([...images, ...validFiles]);

    // Create previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!location)
      newErrors.location =
        "Please select location on map or use current location";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log("Submit clicked");

    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      // Upload images first
      let imageUrls = [];
      if (images.length > 0) {
        setUploadingImages(true);
        toast.info("Uploading images...");
        const uploadResponse = await uploadAPI.uploadImages(images);
        imageUrls = uploadResponse.data.urls;
        setUploadingImages(false);
        toast.success("Images uploaded!");
      }

      // Create complaint
      const complaintData = {
        ...formData,
        location,
        images: imageUrls,
      };

      console.log("Creating complaint:", complaintData);
      const response = await complaintAPI.create(complaintData);

      toast.success("Complaint submitted successfully!");
      navigate("/citizen/dashboard");
    } catch (error) {
      console.error("Error creating complaint:", error);
      toast.error(error.response?.data?.error || "Failed to create complaint");
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Report an Issue</h1>
        <p className="text-gray-600 mt-1">
          Help improve your community by reporting civic problems
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Brief description of the issue"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Category and City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <Select
              options={categoryOptions}
              value={categoryOptions.find(
                (opt) => opt.value === formData.category,
              )}
              onChange={(option) => {
                setFormData({ ...formData, category: option?.value || "" });
                if (errors.category) setErrors({ ...errors, category: "" });
              }}
              styles={customSelectStyles}
              placeholder="Select category"
              isSearchable={false}
            />
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <Select
              options={cityOptions}
              value={cityOptions.find((opt) => opt.value === formData.city)}
              onChange={(option) => {
                setFormData({ ...formData, city: option?.value || "" });
                if (errors.city) setErrors({ ...errors, city: "" });
              }}
              styles={customSelectStyles}
              placeholder="Select city"
              isSearchable
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Urgency Level
          </label>
          <div className="grid grid-cols-3 gap-4">
            {APP_CONFIG.urgencyLevels.map((level) => (
              <label key={level.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="urgency"
                  value={level.value}
                  checked={formData.urgency === level.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`p-4 rounded-lg text-center font-semibold transition ${
                    formData.urgency === level.value
                      ? "text-white shadow-lg transform scale-105"
                      : "bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                  style={{
                    backgroundColor:
                      formData.urgency === level.value ? level.color : "white",
                  }}
                >
                  {level.label}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Provide detailed information about the issue..."
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="mb-3">
            <button
              type="button"
              onClick={getCurrentLocation}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <Navigation size={18} className="mr-2" />
              Use Current Location
            </button>
            {location && (
              <p className="mt-2 text-sm text-green-600 font-semibold">
                ✓ Location selected: {location.lat.toFixed(6)},{" "}
                {location.lng.toFixed(6)}
              </p>
            )}
          </div>
          <div className="h-[400px] rounded-lg overflow-hidden border-2 border-gray-300">
            <MapContainer
              center={[
                APP_CONFIG.map.defaultCenter.lat,
                APP_CONFIG.map.defaultCenter.lng,
              ]}
              zoom={APP_CONFIG.map.defaultZoom}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <RecenterMap center={location} />
              <LocationMarker position={location} setPosition={setLocation} />
            </MapContainer>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Click on the map to select location or use the button above
          </p>
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
          )}
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Upload Images (Optional, max 3)
          </label>
          <div className="space-y-4">
            {imagePreviews.length < APP_CONFIG.upload.maxFiles && (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition">
                <Upload size={32} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click to upload images
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            )}

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/citizen/dashboard")}
            disabled={loading}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || uploadingImages}
            className="flex-1 px-6 py-3 text-white rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center"
            style={{ backgroundColor: APP_CONFIG.colors.primary }}
            onMouseEnter={(e) =>
              !loading &&
              (e.target.style.backgroundColor = APP_CONFIG.colors.primaryDark)
            }
            onMouseLeave={(e) =>
              !loading &&
              (e.target.style.backgroundColor = APP_CONFIG.colors.primary)
            }
          >
            {loading || uploadingImages ? (
              <>
                <Loader className="animate-spin mr-2" size={20} />
                {uploadingImages ? "Uploading Images..." : "Submitting..."}
              </>
            ) : (
              "Submit Complaint"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateComplaint;
