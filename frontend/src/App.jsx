import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/layout/Layout";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CitizenDashboard from "./pages/citizen/Dashboard";
import AuthorityDashboard from "./pages/authority/Dashboard.jsx";
import CreateComplaint from "./pages/citizen/CreateComplaint";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ComplaintDetail from "./pages/shared/ComplaintDetail";
import About from "./pages/shared/About.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes - No Layout */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes - With Layout */}
          <Route
            path="/citizen/dashboard"
            element={
              <ProtectedRoute type="citizen">
                <Layout>
                  <CitizenDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/create-complaint"
            element={
              <ProtectedRoute type="citizen">
                <Layout>
                  <CreateComplaint />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/authority/dashboard"
            element={
              <ProtectedRoute type="authority">
                <Layout>
                  <AuthorityDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/complaint/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <ComplaintDetail />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <Layout>
                  <About />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer
          position="top-right"
          style={{ zIndex: 10000000 }}
          autoClose={3000}
        />{" "}
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
