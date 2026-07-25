import React from 'react';
import { Building, Calendar, Edit2, Trash2 } from 'lucide-react';
import Button from '../../../components/ui/Button';

const EducationCard = ({ education, onEdit, onDelete, editable = true }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{education.degree} {education.specialization && `in ${education.specialization}`}</h3>
          <div className="flex items-center text-gray-600 mt-1">
            <Building className="w-4 h-4 mr-2" />
            <span className="font-medium">{education.institutionName}</span>
            {education.university && <span className="text-gray-500 ml-1">({education.university})</span>}
          </div>
          
          <div className="flex items-center text-sm text-gray-500 mt-2 space-x-4">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {education.startYear || 'N/A'} - {education.endYear || 'N/A'}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              education.status === 'Completed' ? 'bg-green-100 text-green-800' :
              education.status === 'Pursuing' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {education.status}
            </span>
          </div>

          <div className="mt-3 flex gap-4 text-sm">
            {education.cgpa != null && (
              <div>
                <span className="text-gray-500">CGPA: </span>
                <span className="font-medium text-gray-900">{education.cgpa}</span>
              </div>
            )}
            {education.percentage != null && (
              <div>
                <span className="text-gray-500">Percentage: </span>
                <span className="font-medium text-gray-900">{education.percentage}%</span>
              </div>
            )}
          </div>
        </div>
        
        {editable && (
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" onClick={() => onEdit(education)}>
              <Edit2 className="w-4 h-4 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(education._id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationCard;
