import React, { useState } from 'react';
import { FileText, Trash2, Calendar, Star, File as FileIcon, Clock, CheckCircle, AlertTriangle, Download, Loader2 } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { resumeApi } from '../../../services/resumeApi';
import toast from 'react-hot-toast';

const ResumeCard = ({ resume, onDelete, onSetPrimary, onRetryParsing }) => {
  const [isDownloading, setIsDownloading] = useState(false);

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
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'FAILED': return 'bg-rose-50 text-rose-700 border border-rose-200';
      case 'PENDING': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'IN_PROGRESS':
      case 'PROCESSING': return 'bg-blue-50 text-blue-700 border border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const renderStatusBadge = (label, status) => {
    if (!status) return null;
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(status)}`}>
        {status === 'COMPLETED' ? <CheckCircle className="w-3 h-3 mr-1 text-emerald-600" /> :
         status === 'FAILED' ? <AlertTriangle className="w-3 h-3 mr-1 text-rose-600" /> :
         <Clock className="w-3 h-3 mr-1 text-amber-600" />}
        {label}: {status}
      </span>
    );
  };

  const handleViewFile = async () => {
    setIsDownloading(true);
    try {
      const blob = await resumeApi.downloadResume(resume._id);
      const mimeType = resume.fileType || 'application/pdf';
      const fileBlob = new Blob([blob], { type: mimeType });
      const blobUrl = window.URL.createObjectURL(fileBlob);
      window.open(blobUrl, '_blank');
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60000);
    } catch (err) {
      console.error('Failed to view resume:', err);
      toast.error('Failed to open resume file. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 relative group h-full flex flex-col ${resume.isPrimary ? 'border-primary-300 ring-2 ring-primary-100' : 'border-gray-200'}`}>

      {/* Primary Badge */}
      {resume.isPrimary && (
        <div className="absolute -top-3 -right-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-600 text-white shadow-sm">
            <Star className="w-3 h-3 mr-1 fill-current" /> Primary
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {onDelete && (
          <button
            onClick={() => onDelete(resume._id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Resume"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-start gap-3 pr-12">
        <div className="bg-primary-50 p-2.5 rounded-xl text-primary-600 shrink-0">
          <FileText className="w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 text-base leading-snug truncate" title={resume.originalFileName}>
            {resume.originalFileName}
          </h3>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Badge variant="secondary" className="text-xs font-medium">v{resume.version || 1}</Badge>
            {renderStatusBadge('Upload', resume.uploadStatus)}
            {renderStatusBadge('Parse', resume.parsingStatus)}
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-xs text-gray-500 flex-grow">
        <div className="flex items-center">
          <FileIcon className="w-3.5 h-3.5 mr-2 text-gray-400 shrink-0" />
          <span>
            {formatFileSize(resume.fileSize)} • {resume.fileType?.split('/')[1]?.toUpperCase() || 'DOCUMENT'}
          </span>
        </div>

        <div className="flex items-center">
          <Calendar className="w-3.5 h-3.5 mr-2 text-gray-400 shrink-0" />
          <span>
            Uploaded: {new Date(resume.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
        </div>

        {resume.parsedAt && (
          <div className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-2 text-gray-400 shrink-0" />
            <span>
              Parsed: {new Date(resume.parsedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <div>
          {!resume.isPrimary ? (
            <button
              onClick={() => onSetPrimary && onSetPrimary(resume._id)}
              className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline"
            >
              Set as Primary
            </button>
          ) : (
            <span className="text-xs font-medium text-primary-700 flex items-center">
              <Star className="w-3 h-3 mr-1 fill-current" /> Active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {resume.parsingStatus === 'FAILED' && onRetryParsing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRetryParsing(resume._id)}
              className="text-xs text-amber-700 border-amber-300 hover:bg-amber-50 h-7 px-2"
            >
              Retry Parse
            </Button>
          )}
          <button
            onClick={handleViewFile}
            disabled={isDownloading}
            className="text-xs font-medium text-gray-700 hover:text-primary-600 flex items-center gap-1 bg-gray-50 hover:bg-gray-100 px-2.5 py-1.5 rounded-md transition-colors"
          >
            {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>{isDownloading ? 'Opening...' : 'View File'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;
