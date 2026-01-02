import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { complaintAPI } from "../../utils/api";
import { toast } from "react-toastify";
import APP_CONFIG from "../../config/app.config";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  Plus,
  MapPin,
  TrendingUp,
  AlertCircle,
  Search,
  Filter,
  X,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

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

// Custom marker icons by status
const getMarkerIcon = (status) => {
  const color = APP_CONFIG.statusColors[status] || "#gray";
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
};

const getStatusLabel = (status) => {
  if (status === "solved") return "awaiting verification";
  return status;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    urgency: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await complaintAPI.getNearby({
        lat: APP_CONFIG.map.defaultCenter.lat,
        lng: APP_CONFIG.map.defaultCenter.lng,
        radius: 10,
      });
      setComplaints(response.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesStatus =
      !filters.status || complaint.status === filters.status;
    const matchesCategory =
      !filters.category || complaint.category === filters.category;
    const matchesUrgency =
      !filters.urgency || complaint.urgency === filters.urgency;
    const matchesSearch =
      !searchQuery ||
      complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesCategory && matchesUrgency && matchesSearch;
  });

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in-progress").length,
    resolved: complaints.filter(
      (c) => c.status === "solved" || c.status === "verified",
    ).length,
  };

  const hasActiveFilters =
    filters.status || filters.category || filters.urgency || searchQuery;

  const clearFilters = () => {
    setFilters({ status: "", category: "", urgency: "" });
    setSearchQuery("");
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">
            Welcome back, {user?.name}!
          </p>
        </div>
        <Link
          to="/citizen/create-complaint"
          className="flex items-center justify-center px-6 py-3 text-white rounded-lg shadow-lg transition font-semibold text-sm md:text-base"
          style={{ backgroundColor: APP_CONFIG.colors.primary }}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = APP_CONFIG.colors.primaryDark)
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = APP_CONFIG.colors.primary)
          }
        >
          <Plus size={20} className="mr-2" />
          Report Issue
        </Link>
      </div>

      {/* Stats - Compact on Mobile */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div
          className="bg-white p-4 rounded-lg shadow-sm border-l-4"
          style={{ borderColor: APP_CONFIG.colors.primary }}
        >
          <p className="text-gray-600 text-xs font-medium">Total</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
            {stats.total}
          </p>
        </div>

        <div
          className="bg-white p-4 rounded-lg shadow-sm border-l-4"
          style={{ borderColor: APP_CONFIG.statusColors.pending }}
        >
          <p className="text-gray-600 text-xs font-medium">Pending</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
            {stats.pending}
          </p>
        </div>

        <div
          className="bg-white p-4 rounded-lg shadow-sm border-l-4"
          style={{ borderColor: APP_CONFIG.statusColors["in-progress"] }}
        >
          <p className="text-gray-600 text-xs font-medium">Active</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
            {stats.inProgress}
          </p>
        </div>

        <div
          className="bg-white p-4 rounded-lg shadow-sm border-l-4"
          style={{ borderColor: APP_CONFIG.statusColors.solved }}
        >
          <p className="text-gray-600 text-xs font-medium">Resolved</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
            {stats.resolved}
          </p>
        </div>
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">
        {/* Map - Larger and More Prominent */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-lg overflow-hidden order-1">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              Complaint Map
            </h2>
            <p className="text-xs md:text-sm text-gray-600 mt-1">
              Click markers to view details
            </p>
          </div>
          <div className="h-[400px] md:h-[600px]">
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
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {filteredComplaints.map((complaint) => (
                <Marker
                  key={complaint._id}
                  position={[complaint.location.lat, complaint.location.lng]}
                  icon={getMarkerIcon(complaint.status)}
                >
                  <Tooltip direction="top" offset={[0, -15]} opacity={0.9}>
                    <div className="text-xs font-semibold">
                      {complaint.title.length > 30
                        ? complaint.title.substring(0, 30) + "..."
                        : complaint.title}
                    </div>
                  </Tooltip>
                  <Popup maxWidth={300}>
                    <div className="p-2">
                      <h3 className="font-bold text-gray-900 mb-2 text-sm">
                        {complaint.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                        {complaint.description}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                          style={{
                            backgroundColor:
                              APP_CONFIG.statusColors[complaint.status],
                          }}
                        >
                          {getStatusLabel(complaint.status)}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {complaint.category}
                        </span>
                      </div>
                      <Link
                        to={`/complaint/${complaint._id}`}
                        className="block text-center px-3 py-2 rounded-lg text-white text-xs font-semibold hover:opacity-90 transition"
                        style={{ backgroundColor: APP_CONFIG.colors.primary }}
                      >
                        View Details
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Complaints List - Sidebar */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg order-2">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                Complaints
              </h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                <Filter size={16} className="mr-1" />
                Filters
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search complaints..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Filters - Collapsible */}
            {showFilters && (
              <div className="mt-3 space-y-2">
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">All Status</option>
                  {APP_CONFIG.statuses.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.value === "solved" ? "Pending Verification" : s.label}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">All Categories</option>
                  {APP_CONFIG.categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.urgency}
                  onChange={(e) =>
                    setFilters({ ...filters, urgency: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">All Urgency</option>
                  {APP_CONFIG.urgencyLevels.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full flex items-center justify-center px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    <X size={16} className="mr-1" />
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* List */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "calc(600px - 140px)" }}
          >
            {loading ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                Loading complaints...
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="p-8 text-center">
                <AlertCircle size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 text-sm">No complaints found</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-3 text-sm text-blue-600 hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredComplaints.map((complaint) => (
                  <Link
                    key={complaint._id}
                    to={`/complaint/${complaint._id}`}
                    className="block p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 flex-1 mr-2">
                        {complaint.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {complaint.status === "solved" && (
                          <Clock size={14} className="text-yellow-600" />
                        )}
                        <span
                          className="px-2 py-1 rounded-full text-xs font-semibold text-white whitespace-nowrap"
                          style={{
                            backgroundColor:
                              APP_CONFIG.statusColors[complaint.status],
                          }}
                        >
                          {getStatusLabel(complaint.status)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                      {complaint.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="capitalize">{complaint.category}</span>
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-semibold ${
                            complaint.urgency === "high"
                              ? "text-red-600"
                              : complaint.urgency === "medium"
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        >
                          {complaint.urgency}
                        </span>
                        <span>↑ {complaint.upvoteCount}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend - Mobile Hidden, Desktop Visible */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Map Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: APP_CONFIG.statusColors.pending }}
            ></div>
            <span className="text-xs text-gray-600">Pending</span>
          </div>
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{
                backgroundColor: APP_CONFIG.statusColors["in-progress"],
              }}
            ></div>
            <span className="text-xs text-gray-600">In Progress</span>
          </div>
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: APP_CONFIG.statusColors.solved }}
            ></div>
            <span className="text-xs text-gray-600">Awaiting Verification</span>
          </div>
          <div className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: APP_CONFIG.statusColors.verified }}
            ></div>
            <span className="text-xs text-gray-600">Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
