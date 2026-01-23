import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Home } from './components/Home';
import { SymptomAnalyzer } from './components/SymptomAnalyzer';
import { PharmacyFinder } from './components/PharmacyFinder';
import { DiagnosticCenters } from './components/DiagnosticCenters';
import { LabReportAnalyzer } from './components/LabReportAnalyzer';
import { DoctorConsultation } from './components/DoctorConsultation';
import { Dashboard } from './components/Dashboard';
import { PatientDashboard } from './components/dashboards/PatientDashboard';
import { DoctorDashboard } from './components/dashboards/DoctorDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { UserProfile } from './components/UserProfile';
import { BloodBank } from './components/BloodBank';
import { Navigation } from './components/Navigation';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

export type Page = 'home' | 'symptom-analyzer' | 'pharmacy' | 'diagnostics' | 'lab-reports' | 'doctors' | 'dashboard' | 'patient-dashboard' | 'doctor-dashboard' | 'admin-dashboard' | 'login' | 'signup' | 'profile' | 'blood-bank';

function AppContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser && !user) {
      // User data will be loaded by AuthContext
    }
  }, [user]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'login':
        return <Login onNavigate={setCurrentPage} />;
      case 'signup':
        return <SignUp onNavigate={setCurrentPage} />;
      case 'profile':
        return <UserProfile onNavigate={setCurrentPage} />;
      case 'symptom-analyzer':
        return (
          <SymptomAnalyzer
            onNavigate={setCurrentPage}
            onAnalysisComplete={() => {}}
          />
        );
      case 'pharmacy':
        return <PharmacyFinder recommendedMedicines={[]} />;
      case 'diagnostics':
        return <DiagnosticCenters recommendedTests={[]} />;
      case 'lab-reports':
        return <LabReportAnalyzer onNavigate={setCurrentPage} />;
      case 'doctors':
        return <DoctorConsultation />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'patient-dashboard':
        return user ? <PatientDashboard onNavigate={setCurrentPage} /> : <Home onNavigate={setCurrentPage} />;
      case 'doctor-dashboard':
        return user ? <DoctorDashboard user={user} /> : <Home onNavigate={setCurrentPage} />;
      case 'admin-dashboard':
        return user ? <AdminDashboard user={user} /> : <Home onNavigate={setCurrentPage} />;
      case 'blood-bank':
        return <BloodBank onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  const showNavigation = currentPage !== 'home' && currentPage !== 'login' && currentPage !== 'signup';
  const showFooter = currentPage === 'home' || currentPage === 'login' || currentPage === 'signup';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      {showNavigation && <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />}
      <main className="flex-1">
        {renderPage()}
      </main>
      {showFooter && <Footer onNavigate={setCurrentPage} />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
