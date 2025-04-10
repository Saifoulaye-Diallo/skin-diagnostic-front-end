import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, BarChart2, Stethoscope, Clock, FileX, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { fetchDiagnostics, deleteDiagnostic } from '../redux/slices/diagnosticSlice';
import { RootState } from '../redux/store';
import Loader from '../components/Loader';
import Alert from '../components/Alert';

const Historique = () => {
  const dispatch = useDispatch();
  const { diagnostics, loading, error } = useSelector(
    (state: RootState) => state.diagnostic
  );
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchDiagnostics());
    };
    fetchData();
  }, [dispatch]);

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'PPP à HH:mm', { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date invalide';
    }
  };

  const handleDelete = useCallback(async (id: string) => {
    if (isDeleting) return;
    
    if (deleteConfirmation === id) {
      try {
        setIsDeleting(true);
        await dispatch(deleteDiagnostic(id));
        setDeleteConfirmation(null);
      } finally {
        setIsDeleting(false);
      }
    } else {
      setDeleteConfirmation(id);
    }
  }, [deleteConfirmation, dispatch, isDeleting]);

  const handleCancelDelete = useCallback(() => {
    setDeleteConfirmation(null);
  }, []);

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

        {loading && !isDeleting && (
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
                  <div className="md:w-1/3 relative group">
                    <img
                      src={diagnostic.image}
                      alt="Lésion"
                      className="w-full h-64 object-cover"
                    />
                    <button
                      onClick={() => handleDelete(diagnostic.id)}
                      disabled={isDeleting}
                      className={`absolute top-2 right-2 p-2 rounded-full 
                        ${deleteConfirmation === diagnostic.id 
                          ? 'bg-red-600 text-white hover:bg-red-700' 
                          : 'bg-white/80 text-gray-700 hover:bg-white hover:text-red-600'} 
                        backdrop-blur-sm transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    {deleteConfirmation === diagnostic.id && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                        <div className="text-center p-4">
                          <p className="text-white mb-4">Confirmer la suppression ?</p>
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleDelete(diagnostic.id)}
                              disabled={isDeleting}
                              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isDeleting ? 'Suppression...' : 'Confirmer'}
                            </button>
                            <button
                              onClick={handleCancelDelete}
                              disabled={isDeleting}
                              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
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
