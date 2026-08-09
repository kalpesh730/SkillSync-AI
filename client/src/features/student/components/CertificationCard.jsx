import React from 'react';
import { Pencil, Trash2, Award, Calendar, ExternalLink } from 'lucide-react';
import Badge from '../../../components/ui/Badge';

const CertificationCard = ({ certification, onEdit, onDelete }) => {
  const isExpired = certification.expiryDate && new Date(certification.expiryDate) < new Date();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow relative group h-full flex flex-col">
      {(onEdit || onDelete) && (
        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={() => onEdit(certification)}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Edit Certification"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(certification._id)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete Certification"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      <div className="flex items-start gap-3 pr-16">
        <div className="bg-blue-100 p-2 rounded-lg text-blue-600 shrink-0">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1">{certification.name}</h3>
          <p className="text-gray-600 font-medium">{certification.issuingOrganization}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-gray-600 flex-grow">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          <span>
            Issued: {certification.issueDate ? new Date(certification.issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : 'N/A'}
            {certification.expiryDate && ` · Expires: ${new Date(certification.expiryDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}`}
          </span>
          {isExpired && (
            <span className="ml-2 text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
              Expired
            </span>
          )}
        </div>

        {certification.credentialId && (
          <div className="flex items-center">
            <span className="font-medium text-gray-700 mr-2">Credential ID:</span> 
            {certification.credentialId}
          </div>
        )}

        {certification.description && (
          <p className="mt-3 text-gray-700 line-clamp-3">
            {certification.description}
          </p>
        )}
      </div>

      {((certification.skills && certification.skills.length > 0) || certification.credentialUrl) && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {certification.skills?.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {certification.skills?.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{certification.skills.length - 3} more
              </Badge>
            )}
          </div>
          
          {certification.credentialUrl && (
            <a 
              href={certification.credentialUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 shrink-0"
            >
              Verify Credential <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default CertificationCard;
