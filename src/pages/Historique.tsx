import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, BarChart2, Stethoscope, Clock, FileX } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { fetchDiagnostics } from '../redux/slices/diagnosticSlice';
import { RootState } from '../redux/store';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import { AppDispatch } from '../redux/store'; // adapte le chemin si nécessaire

const Historique = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { diagnostics, loading, error } = useSelector(
    (state: RootState) => state.diagnostic
  );

  useEffect(() => {
    dispatch(fetchDiagnostics());
  }, [dispatch]);

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'PPP à HH:mm', { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date invalide';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/dashboard"
            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour au tableau de bord
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Historique des diagnostics
          </h1>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        )}

        {error && <Alert type="error" message={error} />}

        {!loading && (!diagnostics || diagnostics.length === 0) && (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-lg border border-gray-100">
            <FileX className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun diagnostic disponible
            </h2>
            <p className="text-gray-600 mb-6">
              Commencez par soumettre une image pour obtenir un diagnostic
            </p>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Nouveau diagnostic
            </Link>
          </div>
        )}

        {!loading && diagnostics && diagnostics.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {diagnostics.map((diagnostic) => (
              <div key={diagnostic.id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <img
                      src={diagnostic.image}
                      alt="Lésion"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <User className="w-5 h-5 text-blue-600" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            {diagnostic.firstName} {diagnostic.lastName}
                          </h3>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Date de naissance : {diagnostic.birthDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Date du diagnostic : {formatDate(diagnostic.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Stethoscope className="w-5 h-5 text-blue-600" />
                          <h3 className="text-lg font-semibold text-gray-900">
                            Résultat du diagnostic
                          </h3>
                        </div>
                        <div className="space-y-3">
                          <p className="text-gray-800">
                            <span className="font-medium">Diagnostic :</span> {diagnostic.diagnosis}
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <BarChart2 className="w-4 h-4 text-blue-600" />
                              <span className="text-gray-600">Niveau de confiance</span>
                            </div>
                            <div className="flex-1 flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${(diagnostic.confidence * 100).toFixed(1)}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600">
                                {(diagnostic.confidence * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Historique;