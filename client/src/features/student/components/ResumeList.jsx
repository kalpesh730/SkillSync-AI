import React, { useEffect, useState, useRef } from 'react';
import { Plus, UploadCloud } from 'lucide-react';
import { useResumeStore } from '../../../store/resumeStore';
import ResumeCard from './ResumeCard';
import ResumeMetadataForm from './ResumeMetadataForm';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import LoadingSkeleton from '../../../components/ui/LoadingSkeleton';
import EmptyState from '../../../components/ui/EmptyState';
import ConfirmationDialog from '../../../components/ui/ConfirmationDialog';
import Button from '../../../components/ui/Button';

const ResumeList = () => {
  const { resumes, isLoading, error, fetchResumes, uploadResume, updateResume, setPrimaryResume, deleteResume, retryParsing, clearError } = useResumeStore();
  
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  
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
      await updateResume(editingResume._id, data);
    }
    // We only support editing metadata right now, not uploading new files
    // else { await createResume(data); }
    setIsFormOpen(false);
    setEditingResume(null);
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmDialog({ isOpen: true, id });
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmDialog.id) {
      await deleteResume(deleteConfirmDialog.id);
    }
    setDeleteConfirmDialog({ isOpen: false, id: null });
  };

  const handleSetPrimary = async (id) => {
    await setPrimaryResume(id);
  };

  const handleRetryParsing = async (id) => {
    await retryParsing(id);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be under 10MB');
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64File = reader.result;
        
        await uploadResume({
          originalFileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          base64File
        });
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsUploading(false);
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
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <div></div>
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
            className="hidden" 
          />
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isUploading || isLoading}
            className="flex items-center"
          >
            {isUploading ? <LoadingSpinner size="sm" className="mr-2" /> : <UploadCloud className="w-4 h-4 mr-2" />}
            {isUploading ? 'Uploading...' : 'Upload Resume'}
          </Button>
        </div>
      </div>
      
      {resumes.length === 0 ? (
        <EmptyState
          title="No Resumes Uploaded"
          description="You haven't uploaded any resumes yet."
          icon={<Plus className="w-6 h-6" />}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          )}
          {resumes.map(resume => (
            <div key={resume._id} className="relative group">
               {/* We wrap it to add an edit button at the top right alongside delete from the card */}
               <div className="absolute top-4 right-12 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button
                   onClick={() => handleEditClick(resume)}
                   className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors bg-white shadow-sm border border-gray-200"
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
