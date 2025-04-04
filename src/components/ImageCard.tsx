import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, User, BarChart } from 'lucide-react';

interface ImageCardProps {
  image: string;
  diagnosis: string;
  date: string;
  confidence: number;
  patientName: string;
}

const ImageCard: React.FC<ImageCardProps> = ({
  image,
  diagnosis,
  date,
  confidence,
  patientName,
}) => {
  const formattedDate = format(new Date(date), 'PPP', { locale: fr });
  const confidencePercentage = (confidence * 100).toFixed(1);

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <img
        src={image}
        alt="Lésion"
        className="w-full h-48 object-cover"
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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-500">
              <BarChart className="w-4 h-4" />
              <span className="text-sm">Confiance</span>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${confidencePercentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">{confidencePercentage}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCard;