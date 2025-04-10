import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, User, BarChart } from 'lucide-react';

interface ImageCardProps {
  image: string;
  diagnosis: string;
  date?: string;
  patientName: string;
}

const ImageCard: React.FC<ImageCardProps> = ({
  image,
  diagnosis,
  date,
  patientName,
}) => {

let formattedDate = 'Date invalide';
try {
  formattedDate = date ? format(new Date(date), 'PPP', { locale: fr }) : 'Date inconnue';
} catch (error) {
  console.error('Erreur formatage date :', date, error);
}



  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <img
        src={image}
        alt={diagnosis}
        className="w-full h-48 object-cover"
        crossOrigin="anonymous"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">{patientName}</h3>
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{formattedDate}</span>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-gray-700">
            <span className="font-medium">Diagnostic :</span> {diagnosis}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
