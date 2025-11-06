import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Students from './pages/Students';
import Reports from './pages/Reports';
import { SchoolProvider } from './contexts/SchoolContext';

function App() {
  return (
    <SchoolProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/students" element={<Students />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
    </SchoolProvider>
  );
}

export default App
