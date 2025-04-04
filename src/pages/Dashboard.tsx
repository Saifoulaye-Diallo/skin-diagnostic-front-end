import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { History, FileX } from 'lucide-react';
import { RootState } from '../redux/store';
import DiagnosticForm from '../components/DiagnosticForm';
import LogoutButton from '../components/LogoutButton';
import Alert from '../components/Alert';
import ImageCard from '../components/ImageCard';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { currentDiagnostic, loading, error } = useSelector(
    (state: RootState) => state.diagnostic
  );
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Diagnostic de lésions cutanées
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/historique"
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <History className="w-5 h-5" />
                <span>Historique</span>
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
            <div className="w-full lg:w-1/2 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Nouveau diagnostic
              </h2>
              {error && <Alert type="error" message={error} />}
              {showSuccess && (
                <Alert
                  type="success"
                  message="Le diagnostic a été soumis avec succès"
                />
              )}
              <DiagnosticForm onSuccess={handleSuccess} />
            </div>

            <div className="w-full lg:w-1/2 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Résultat du diagnostic
              </h2>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader />
                  <p className="mt-4 text-gray-600">Analyse en cours...</p>
                </div>
              ) : currentDiagnostic ? (
                <ImageCard
                  image={currentDiagnostic.image}
                  diagnosis={currentDiagnostic.diagnosis}
                  date={currentDiagnostic.created_at}
                  confidence={currentDiagnostic.confidence}
                  patientName={`${currentDiagnostic.firstName} ${currentDiagnostic.lastName}`}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <FileX className="w-16 h-16 mb-4" />
                  <p className="text-lg font-medium">Aucun diagnostic en cours</p>
                  <p className="text-sm">Soumettez une image pour obtenir un diagnostic</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;