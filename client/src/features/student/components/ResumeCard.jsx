import React from 'react';
import { FileText, Trash2, Calendar, Star, File as FileIcon, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';

const ResumeCard = ({ resume, onDelete, onSetPrimary, onRetryParsing }) => {
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'FAILED': return 'bg-red-100 text-red-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'PROCESSING': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const renderStatusBadge = (label, status) => {
    if (!status) return null;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(status)}`}>
        {status === 'COMPLETED' ? <CheckCircle className="w-3 h-3 mr-1" /> : 
         status === 'FAILED' ? <AlertTriangle className="w-3 h-3 mr-1" /> : 
         <Clock className="w-3 h-3 mr-1" />}
        {label}: {status}
      </span>
    );
  };

  return (
    <div className={`bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow relative group h-full flex flex-col ${resume.isPrimary ? 'border-blue-300 ring-1 ring-blue-100' : 'border-gray-200'}`}>
      
      {/* Primary Badge */}
      {resume.isPrimary && (
        <div className="absolute -top-3 -right-3">
          <div className="bg-blue-600 text-white rounded-full p-1.5 shadow-md" title="Primary Resume">
            <Star className="w-4 h-4 fill-current" />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {onDelete && (
          <button
            onClick={() => onDelete(resume._id)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete Resume"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-start gap-3 pr-16">
        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 shrink-0">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1 truncate" title={resume.originalFileName}>
            {resume.originalFileName}
          </h3>
          <div className="flex flex-wrap gap-2 mt-1.5">
            <Badge variant="secondary" className="text-xs">Version {resume.version}</Badge>
            {renderStatusBadge('Upload', resume.uploadStatus)}
            {renderStatusBadge('Parsing', resume.parsingStatus)}
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-gray-600 flex-grow">
        <div className="flex items-center">
          <FileIcon className="w-4 h-4 mr-2 text-gray-400" />
          <span>
            {formatFileSize(resume.fileSize)} • {resume.fileType?.split('/')[1]?.toUpperCase() || 'Document'}
          </span>
        </div>
        
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
          <span>
            Uploaded: {new Date(resume.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
        </div>
        
        {resume.parsedAt && (
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            <span>
              Parsed: {new Date(resume.parsedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        {!resume.isPrimary ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onSetPrimary && onSetPrimary(resume._id)}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            Set as Primary
          </Button>
        ) : (
          <span className="text-sm font-medium text-blue-600 flex items-center">
            <Star className="w-4 h-4 mr-1 fill-current" /> Active Resume
          </span>
        )}
        <div className="flex space-x-3">
          {resume.parsingStatus === 'FAILED' && onRetryParsing && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onRetryParsing(resume._id)}
              className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
            >
              Retry AI Parse
            </Button>
          )}
          <a 
            href={`${import.meta.env.VITE_API_URL}/resumes/${resume._id}/file`}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 underline flex items-center"
          >
            View File
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;
