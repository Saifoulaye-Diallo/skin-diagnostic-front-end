import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { User, Calendar } from 'lucide-react';
import { updateDiagnostic } from '../redux/slices/diagnosticSlice';

interface UpdateDiagnosticFormProps {
  diagnostic: {
    id: string;
    firstName: string;
    lastName: string;
    birthDate: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

const UpdateDiagnosticForm: React.FC<UpdateDiagnosticFormProps> = ({
  diagnostic,
  onSuccess,
  onCancel,
}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: diagnostic.firstName,
    lastName: diagnostic.lastName,
    birthDate: diagnostic.birthDate,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await dispatch(updateDiagnostic({
        id: diagnostic.id,
        ...formData
      }));
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            Prénom
          </label>
          <input
            type="text"
            id="firstName"
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            Nom
          </label>
          <input
            type="text"
            id="lastName"
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          Date de naissance
        </label>
        <input
          type="date"
          id="birthDate"
          required
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          value={formData.birthDate}
          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
        </button>
      </div>
    </form>
  );
};

export default UpdateDiagnosticForm;