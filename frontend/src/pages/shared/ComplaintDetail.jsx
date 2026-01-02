import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { complaintAPI, verificationAPI } from "../../utils/api";
import { toast } from "react-toastify";
import APP_CONFIG from "../../config/app.config";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  ThumbsUp,
  CheckCircle,
  Loader,
  X,
  Lock,
  Clock,
} from "lucide-react";

// Fix Leaflet marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Helper function to determine verification status
const getVerificationStatus = (complaint, verifications) => {
  if (complaint.status !== "solved" && complaint.status !== "verified") {
    return null;
  }

  const creatorId = complaint.createdBy?._id || complaint.createdBy;
  const creatorVerification = verifications.find(
    (v) => (v.userId?._id || v.userId) === creatorId,
  );

  if (complaint.status === "verified") {
    return { type: "verified", text: "Verified as resolved", color: "green" };
  }

  if (creatorVerification) {
    if (creatorVerification.isResolved) {
      return {
        type: "creator-verified",
        text: "Reporter confirmed resolution",
        color: "green",
      };
    } else {
      return {
        type: "creator-rejected",
        text: "Reporter says not resolved",
        color: "red",
      };
    }
  }

  const otherVerifications = verifications.filter(
    (v) => (v.userId?._id || v.userId) !== creatorId,
  );
  if (otherVerifications.length > 0) {
    return {
      type: "pending-creator",
      text: `Marked as solved - awaiting original reporter's verification (${otherVerifications.length} other${otherVerifications.length > 1 ? "s" : ""} have verified)`,
      color: "yellow",
    };
  }

  return {
    type: "pending-creator",
    text: "Marked as solved - awaiting verification from original reporter",
    color: "yellow",
  };
};

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isCitizen, isAuthority } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [verifications, setVerifications] = useState([]);
  const [hasVerified, setHasVerified] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [upvoting, setUpvoting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyForm, setVerifyForm] = useState({
    isResolved: true,
    comment: "",
  });
  const [submittingVerification, setSubmittingVerification] = useState(false);

  useEffect(() => {
    fetchComplaint();
    fetchVerifications();
    checkUserVerification();
    checkUserUpvoted();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      const response = await complaintAPI.getById(id);
      setComplaint(response.data);
    } catch (error) {
      console.error("Error fetching complaint:", error);
      toast.error("Failed to load complaint");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const fetchVerifications = async () => {
    try {
      const response = await verificationAPI.getByComplaint(id);
      setVerifications(response.data);
    } catch (error) {
      console.error("Error fetching verifications:", error);
    }
  };

  const checkUserVerification = async () => {
    try {
      const response = await verificationAPI.checkVerification(id);
      setHasVerified(response.data.hasVerified);
    } catch (error) {
      console.error("Error checking verification:", error);
    }
  };

  const checkUserUpvoted = () => {
    const upvotedComplaints = JSON.parse(
      localStorage.getItem("upvoted_complaints") || "[]",
    );
    setHasUpvoted(upvotedComplaints.includes(id));
  };

  const handleUpvote = async () => {
    if (hasUpvoted) {
      toast.info("You have already upvoted this complaint");
      return;
    }

    try {
      setUpvoting(true);
      await complaintAPI.upvote(id);

      const upvotedComplaints = JSON.parse(
        localStorage.getItem("upvoted_complaints") || "[]",
      );
      upvotedComplaints.push(id);
      localStorage.setItem(
        "upvoted_complaints",
        JSON.stringify(upvotedComplaints),
      );

      setHasUpvoted(true);
      toast.success("Upvoted!");
      fetchComplaint();
    } catch (error) {
      console.error("Error upvoting:", error);
      toast.error("Failed to upvote");
    } finally {
      setUpvoting(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdatingStatus(true);
      await complaintAPI.updateStatus(id, newStatus);
      toast.success("Status updated successfully");
      fetchComplaint();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleVerificationSubmit = async () => {
    try {
      setSubmittingVerification(true);
      await verificationAPI.create({
        complaintId: id,
        ...verifyForm,
      });
      toast.success("Verification submitted!");
      setShowVerifyModal(false);
      fetchVerifications();
      checkUserVerification();
      fetchComplaint();
    } catch (error) {
      console.error("Error submitting verification:", error);
      toast.error("Failed to submit verification");
    } finally {
      setSubmittingVerification(false);
    }
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      pending: "in-progress",
      "in-progress": "solved",
    };
    return statusFlow[currentStatus];
  };

  const getStatusButtonText = (currentStatus) => {
    const buttonText = {
      pending: "Start Work",
      "in-progress": "Mark Solved",
    };
    return buttonText[currentStatus];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader
          className="animate-spin"
          size={48}
          style={{ color: APP_CONFIG.colors.primary }}
        />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Complaint not found</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isResolved = complaint.status === "verified";
  const verificationStatus = getVerificationStatus(complaint, verifications);
  const isOriginalReporter =
    user?.id === (complaint?.createdBy?._id || complaint?.createdBy);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </button>

      {/* Verification Status Banner */}
      {verificationStatus && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-start border-2 ${
            verificationStatus.color === "green"
              ? "bg-green-50 border-green-500"
              : verificationStatus.color === "yellow"
                ? "bg-yellow-50 border-yellow-500"
                : "bg-red-50 border-red-500"
          }`}
        >
          {verificationStatus.color === "green" ? (
            <CheckCircle
              size={24}
              className="text-green-600 mr-3 flex-shrink-0"
            />
          ) : verificationStatus.color === "yellow" ? (
            <Clock size={24} className="text-yellow-600 mr-3 flex-shrink-0" />
          ) : (
            <X size={24} className="text-red-600 mr-3 flex-shrink-0" />
          )}
          <div className="flex-1">
            <p
              className={`font-bold ${
                verificationStatus.color === "green"
                  ? "text-green-900"
                  : verificationStatus.color === "yellow"
                    ? "text-yellow-900"
                    : "text-red-900"
              }`}
            >
              {verificationStatus.text}
            </p>
            {verificationStatus.type === "pending-creator" &&
              isOriginalReporter && (
                <p className="text-sm text-yellow-700 mt-1">
                  ⚠️ Please verify if this issue has been resolved
                </p>
              )}
            {verificationStatus.type === "pending-creator" &&
              !isOriginalReporter && (
                <p className="text-sm text-yellow-700 mt-1">
                  ✓ You can verify this now! Original reporter's verification
                  will mark it as complete.
                </p>
              )}{" "}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Complaint Info Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex-1">
                {complaint.title}
              </h1>
              <span
                className="px-4 py-2 rounded-full text-sm font-semibold text-white flex-shrink-0 ml-4"
                style={{
                  backgroundColor: APP_CONFIG.statusColors[complaint.status],
                }}
              >
                {complaint.status === "solved"
                  ? "pending verification"
                  : complaint.status}
              </span>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
              <div>
                <p className="text-xs text-gray-500 mb-1">Category</p>
                <p className="text-sm font-semibold text-gray-900 capitalize">
                  {complaint.category}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Urgency</p>
                <p
                  className={`text-sm font-semibold ${
                    complaint.urgency === "high"
                      ? "text-red-600"
                      : complaint.urgency === "medium"
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
                >
                  {complaint.urgency}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">City</p>
                <p className="text-sm font-semibold text-gray-900">
                  {complaint.city}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Upvotes</p>
                <p className="text-sm font-semibold text-gray-900">
                  {complaint.upvoteCount}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {complaint.description}
              </p>
            </div>

            {/* Images */}
            {complaint.images && complaint.images.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Images</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {complaint.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Complaint ${index + 1}`}
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Reporter Info */}
            <div className="flex items-center text-sm text-gray-600 space-x-4 pt-6 border-t border-gray-200">
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                <span>
                  Reported by {complaint.createdBy?.name || "Anonymous"}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Verifications */}
          {verifications.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Verifications ({verifications.length})
              </h2>
              <div className="space-y-4">
                {verifications.map((verification) => {
                  const isCreator =
                    (verification.userId?._id || verification.userId) ===
                    (complaint.createdBy?._id || complaint.createdBy);
                  return (
                    <div
                      key={verification._id}
                      className={`flex items-start space-x-3 p-4 rounded-lg ${
                        isCreator
                          ? "bg-blue-50 border-2 border-blue-200"
                          : "bg-gray-50"
                      }`}
                    >
                      {verification.isResolved ? (
                        <CheckCircle
                          size={20}
                          className="text-green-600 flex-shrink-0 mt-0.5"
                        />
                      ) : (
                        <X
                          size={20}
                          className="text-red-600 flex-shrink-0 mt-0.5"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <p className="text-sm font-semibold text-gray-900">
                            {verification.userId?.name || "Anonymous"}
                            {isCreator && (
                              <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                                Original Reporter
                              </span>
                            )}
                          </p>
                          <span
                            className={`text-xs font-semibold ${
                              verification.isResolved
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {verification.isResolved
                              ? "✓ Resolved"
                              : "✗ Not Resolved"}
                          </span>
                        </div>
                        {verification.comment && (
                          <p className="text-sm text-gray-600 mt-1">
                            {verification.comment}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(
                            verification.createdAt,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Map */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Location</h2>
            </div>
            <div className="h-64">
              <MapContainer
                center={[complaint.location.lat, complaint.location.lng]}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  position={[complaint.location.lat, complaint.location.lng]}
                />
              </MapContainer>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin size={16} className="mr-2" />
                <span>
                  {complaint.location.lat.toFixed(6)},{" "}
                  {complaint.location.lng.toFixed(6)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-3">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>

            {isResolved && (
              <div className="p-3 bg-gray-100 border border-gray-300 rounded-lg flex items-center text-sm text-gray-600">
                <Lock size={16} className="mr-2" />
                <span>This complaint is verified and closed</span>
              </div>
            )}

            {/* Citizen Actions */}
            {isCitizen() && !isResolved && (
              <>
                <button
                  onClick={handleUpvote}
                  disabled={upvoting || hasUpvoted}
                  className="w-full flex items-center justify-center px-4 py-3 border-2 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    borderColor: hasUpvoted
                      ? APP_CONFIG.colors.success
                      : APP_CONFIG.colors.primary,
                    color: hasUpvoted
                      ? APP_CONFIG.colors.success
                      : APP_CONFIG.colors.primary,
                    backgroundColor: hasUpvoted
                      ? `${APP_CONFIG.colors.success}15`
                      : "white",
                  }}
                >
                  <ThumbsUp size={18} className="mr-2" />
                  {hasUpvoted ? "Upvoted" : upvoting ? "Upvoting..." : "Upvote"}
                </button>
              </>
            )}

            {/* Verify Button - Only for solved status */}
            {isCitizen() && complaint.status === "solved" && !hasVerified && (
              <>
                <button
                  onClick={() => setShowVerifyModal(true)}
                  className={`w-full flex items-center justify-center px-4 py-3 text-white rounded-lg font-semibold transition ${
                    isOriginalReporter
                      ? "ring-2 ring-yellow-400 ring-offset-2"
                      : ""
                  }`}
                  style={{ backgroundColor: APP_CONFIG.colors.primary }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor =
                      APP_CONFIG.colors.primaryDark)
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = APP_CONFIG.colors.primary)
                  }
                >
                  <CheckCircle size={18} className="mr-2" />
                  {isOriginalReporter
                    ? "Verify Resolution (Original Reporter)"
                    : "Verify Resolution"}
                </button>
                {isOriginalReporter && (
                  <p className="text-xs text-yellow-700 text-center bg-yellow-50 p-2 rounded">
                    ⚠️ Your verification is needed to complete this complaint
                  </p>
                )}
              </>
            )}

            {isCitizen() && hasVerified && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 text-center">
                ✓ You have verified this complaint
              </div>
            )}

            {/* Authority Actions */}
            {isAuthority() &&
              (complaint.status === "pending" ||
                complaint.status === "in-progress") && (
                <button
                  onClick={() =>
                    handleStatusUpdate(getNextStatus(complaint.status))
                  }
                  disabled={updatingStatus}
                  className="w-full flex items-center justify-center px-4 py-3 text-white rounded-lg font-semibold transition disabled:opacity-50"
                  style={{ backgroundColor: APP_CONFIG.colors.secondary }}
                  onMouseEnter={(e) =>
                    !updatingStatus &&
                    (e.target.style.backgroundColor =
                      APP_CONFIG.colors.secondaryDark)
                  }
                  onMouseLeave={(e) =>
                    !updatingStatus &&
                    (e.target.style.backgroundColor =
                      APP_CONFIG.colors.secondary)
                  }
                >
                  {updatingStatus ? (
                    <>
                      <Loader className="animate-spin mr-2" size={18} />
                      Updating...
                    </>
                  ) : (
                    getStatusButtonText(complaint.status)
                  )}
                </button>
              )}

            {isAuthority() &&
              (complaint.status === "solved" ||
                complaint.status === "verified") && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 text-center">
                  <CheckCircle size={16} className="inline mr-2" />
                  Work completed -{" "}
                  {complaint.status === "verified"
                    ? "Verified"
                    : "Awaiting verification"}
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Verify Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Verify Resolution
            </h2>
            {isOriginalReporter && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                ℹ️ As the original reporter, your verification is important
              </div>
            )}
            <p className="text-gray-600 mb-4">
              Has this issue been resolved satisfactorily?
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex gap-4">
                <button
                  onClick={() =>
                    setVerifyForm({ ...verifyForm, isResolved: true })
                  }
                  className={`flex-1 p-3 rounded-lg border-2 font-semibold transition ${
                    verifyForm.isResolved
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-300 text-gray-700 hover:border-green-500"
                  }`}
                >
                  Yes, Resolved
                </button>
                <button
                  onClick={() =>
                    setVerifyForm({ ...verifyForm, isResolved: false })
                  }
                  className={`flex-1 p-3 rounded-lg border-2 font-semibold transition ${
                    !verifyForm.isResolved
                      ? "bg-red-500 border-red-500 text-white"
                      : "border-gray-300 text-gray-700 hover:border-red-500"
                  }`}
                >
                  No, Not Resolved
                </button>
              </div>

              <textarea
                value={verifyForm.comment}
                onChange={(e) =>
                  setVerifyForm({ ...verifyForm, comment: e.target.value })
                }
                placeholder="Add a comment (optional)"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowVerifyModal(false)}
                disabled={submittingVerification}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleVerificationSubmit}
                disabled={submittingVerification}
                className="flex-1 px-4 py-3 text-white rounded-lg font-semibold transition disabled:opacity-50"
                style={{ backgroundColor: APP_CONFIG.colors.primary }}
              >
                {submittingVerification ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetail;
