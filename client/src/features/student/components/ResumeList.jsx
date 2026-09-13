import React, { useEffect, useState, useRef } from 'react';
import { Plus, UploadCloud, FileText, AlertCircle } from 'lucide-react';
import { useResumeStore } from '../../../store/resumeStore';
import ResumeCard from './ResumeCard';
import ResumeMetadataForm from './ResumeMetadataForm';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import LoadingSkeleton from '../../../components/ui/LoadingSkeleton';
import EmptyState from '../../../components/ui/EmptyState';
import ConfirmationDialog from '../../../components/ui/ConfirmationDialog';
import Button from '../../../components/ui/Button';
import toast from 'react-hot-toast';

const ALLOWED_MIME_TYPES = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};

const ResumeList = () => {
  const { resumes, isLoading, error, fetchResumes, uploadResume, updateResume, setPrimaryResume, deleteResume, retryParsing, clearError } = useResumeStore();

  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResume, setEditingResume] = useState(null);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({ isOpen: false, id: null });

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const handleEditClick = (resume) => {
    setEditingResume(resume);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    if (editingResume) {
      const res = await updateResume(editingResume._id, data);
      if (res?.success) {
        toast.success('Resume metadata updated successfully');
      } else {
        toast.error(res?.error || 'Failed to update resume metadata');
      }
    }
    setIsFormOpen(false);
    setEditingResume(null);
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmDialog({ isOpen: true, id });
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmDialog.id) {
      const res = await deleteResume(deleteConfirmDialog.id);
      if (res?.success) {
        toast.success('Resume deleted successfully');
      } else {
        toast.error(res?.error || 'Failed to delete resume');
      }
    }
    setDeleteConfirmDialog({ isOpen: false, id: null });
  };

  const handleSetPrimary = async (id) => {
    const res = await setPrimaryResume(id);
    if (res?.success) {
      toast.success('Primary resume updated');
    } else {
      toast.error(res?.error || 'Failed to set primary resume');
    }
  };

  const handleRetryParsing = async (id) => {
    const toastId = toast.loading('Retrying AI parse...');
    const res = await retryParsing(id);
    if (res?.success) {
      toast.success('AI parsing completed successfully', { id: toastId });
    } else {
      toast.error(res?.error || 'AI parsing failed', { id: toastId });
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    clearError();

    // Check extension
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!ALLOWED_MIME_TYPES[ext]) {
      const err = 'Invalid file type. Only PDF, DOC, and DOCX files are supported.';
      setUploadError(err);
      toast.error(err);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Check 10MB size limit
    if (file.size > 10 * 1024 * 1024) {
      const err = 'File size exceeds 10MB limit.';
      setUploadError(err);
      toast.error(err);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const mimeType = ALLOWED_MIME_TYPES[ext] || file.type || 'application/pdf';

    setIsUploading(true);
    const toastId = toast.loading('Uploading resume...');

    try {
      const reader = new FileReader();

      reader.onloadend = async () => {
        try {
          const base64File = reader.result;

          const res = await uploadResume({
            originalFileName: file.name,
            fileType: mimeType,
            fileSize: file.size,
            base64File
          });

          if (res?.success) {
            toast.success('Resume uploaded successfully!', { id: toastId });
            setUploadError(null);
            fetchResumes(); // Ensure fresh list
          } else {
            const errMsg = res?.error || 'Failed to upload resume';
            setUploadError(errMsg);
            toast.error(errMsg, { id: toastId });
          }
        } catch (uploadErr) {
          console.error('Upload error:', uploadErr);
          const errMsg = uploadErr.message || 'Error occurred while saving resume';
          setUploadError(errMsg);
          toast.error(errMsg, { id: toastId });
        } finally {
          setIsUploading(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };

      reader.onerror = () => {
        setIsUploading(false);
        const err = 'Failed to read file from disk';
        setUploadError(err);
        toast.error(err, { id: toastId });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Unexpected file handling error:', err);
      setIsUploading(false);
      const errMsg = err.message || 'Failed to process file';
      setUploadError(errMsg);
      toast.error(errMsg, { id: toastId });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (isLoading && resumes.length === 0) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton height="150px" />
        <LoadingSkeleton height="150px" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {(uploadError || error) && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-lg text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Resume Action Failed</p>
            <p className="text-xs text-rose-600 mt-0.5">{uploadError || error}</p>
          </div>
          <button
            onClick={() => { setUploadError(null); clearError(); }}
            className="text-xs text-rose-500 hover:text-rose-700 font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header with Upload Action */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pb-2 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">My Resumes</h2>
          <p className="text-xs text-gray-500 mt-0.5">Upload and manage your resumes for job applications (PDF, DOC, DOCX up to 10MB)</p>
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            disabled={isUploading}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isLoading}
            className="flex items-center gap-2"
          >
            {isUploading ? <LoadingSpinner size="sm" /> : <UploadCloud className="w-4 h-4" />}
            <span>{isUploading ? 'Uploading...' : 'Upload Resume'}</span>
          </Button>
        </div>
      </div>

      {resumes.length === 0 ? (
        <EmptyState
          title="No Resumes Uploaded"
          description="Upload your resume in PDF, DOC, or DOCX format to get started."
          icon={<FileText className="w-6 h-6 text-gray-400" />}
          actionLabel={isUploading ? 'Uploading...' : 'Upload Resume'}
          onAction={() => fileInputRef.current?.click()}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
          {isLoading && !isUploading && (
            <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-xl">
              <LoadingSpinner />
            </div>
          )}
          {resumes.map(resume => (
            <div key={resume._id} className="relative group">
               {/* Metadata Edit button */}
               <div className="absolute top-4 right-12 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button
                   onClick={() => handleEditClick(resume)}
                   className="p-1.5 text-xs font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors bg-white shadow-sm border border-gray-200"
                   title="Edit Metadata"
                 >
                   Edit
                 </button>
               </div>
               <ResumeCard
                 resume={resume}
                 onDelete={handleDeleteClick}
                 onSetPrimary={handleSetPrimary}
                 onRetryParsing={handleRetryParsing}
               />
            </div>
          ))}
        </div>
      )}

      <ResumeMetadataForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingResume(null);
        }}
        resume={editingResume}
        onSubmit={handleFormSubmit}
      />

      <ConfirmationDialog
        isOpen={deleteConfirmDialog.isOpen}
        onClose={() => setDeleteConfirmDialog({ isOpen: false, id: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Resume"
        message="Are you sure you want to delete this resume? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default ResumeList;
