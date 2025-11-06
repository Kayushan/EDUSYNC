import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SchoolProvider } from './contexts/SchoolContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Students from './pages/Students';
import Reports from './pages/Reports';

// Public Layout (no header/sidebar)
const PublicLayout = ({ children }) => (
  <div className="min-h-screen">
    {children}
  </div>
);

// Protected Layout (with header/sidebar)
const ProtectedLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <SchoolProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          } />
          <Route path="/register" element={
            <PublicLayout>
              <Register />
            </PublicLayout>
          } />
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <PublicLayout>
                <Onboarding />
              </PublicLayout>
            </ProtectedRoute>
          } />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            </ProtectedRoute>
          } />
          <Route path="/students" element={
            <ProtectedRoute requiredRole="teacher">
              <ProtectedLayout>
                <Students />
              </ProtectedLayout>
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute requiredRole="teacher">
              <ProtectedLayout>
                <Reports />
              </ProtectedLayout>
            </ProtectedRoute>
          } />
          
          {/* Fallback route */}
          <Route path="*" element={
            <PublicLayout>
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-8">Page not found</p>
                  <a 
                    href="/"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Go Home
                  </a>
                </div>
              </div>
            </PublicLayout>
          } />
        </Routes>
      </SchoolProvider>
    </AuthProvider>
  );
}

export default App
